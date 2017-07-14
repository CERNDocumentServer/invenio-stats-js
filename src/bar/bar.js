/*
 * This file is part of Invenio.
 * Copyright (C) 2017 CERN.
 *
 * Invenio is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation; either version 2 of the
 * License, or (at your option) any later version.
 *
 * Invenio is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Invenio; if not, write to the Free Software Foundation, Inc.,
 * 59 Temple Place, Suite 330, Boston, MA 02111-1307, USA.
 *
 * In applying this license, CERN does not
 * waive the privileges and immunities granted to it by virtue of its status
 * as an Intergovernmental Organization or submit itself to any jurisdiction.
 */

import * as d3 from 'd3';
import _ from 'lodash';
import Graph from '../graph/graph';

/**
 * Class representing a Bar Graph.
 * @extends Graph
 */
class BarGraph extends Graph {
  /**
   * Create a bar graph in the DOM.
   * @param {Array<Object>} - The input data.
   * @return {Object} The SVG element containing the bar graph.
   */
  render(data) {
    // If does not exist, create a container SVG element
    this.svg = d3.select('.container').empty() ? super.render() : d3.select('.container');

    // Get the options for the X, Y axis
    const xAxisOptions = this.config.axis.x.options;
    const yAxisOptions = this.config.axis.y.options;

    // Parse input data
    data.forEach((d) => {
      if (this.config.axis.x.scale.type === 'scaleTime') {
        _.set(d, this.keyX, d3.timeParse(this.config.scale.format)(_.get(d, this.keyX)));
      }
      _.set(d, this.keyY, +_.get(d, this.keyY));
    });

    // Create the scale for the X axis
    const x = d3[this.config.axis.x.scale.type]();

    if (this.config.axis.x.scale.type === 'scaleTime') {
      x.range([0, this.config.width]);
      x.domain(d3.extent(data, d => _.get(d, this.keyX)));
    } else {
      x.range([this.config.width, 0]);
      x.domain(data.map(d => _.get(d, this.keyX)));
      x.padding(0.05);
    }

    // Create the X Axis
    const xAxis = d3.axisBottom(x)
      .tickSizeOuter(0);

    if (this.config.axis.x.scale.type === 'scaleTime') {
      xAxis.ticks(xAxisOptions.ticks.number);
      xAxis.tickFormat(d3.timeFormat(this.config.axis.x.scale.format));
    } else {
      xAxis.tickValues(
        x.domain().filter((d, i) => !(i % xAxisOptions.ticks.number)));
    }

    // Add the X Axis to the container element
    if (d3.select('.x.axis').empty()) {
      this.svg.append('g')
        .attr('transform', `translate(0, ${this.config.height})`)
        .attr('class', 'x axis')
        .call(xAxis);
    } else {
      d3.select('.x.axis')
        .transition()
        .duration(500)
        .call(xAxis);
    }

    // If specified, add gridlines along the X axis
    if (xAxisOptions.gridlines) {
      if (d3.select('.gridX').empty()) {
        this.svg.append('g')
          .attr('transform', `translate(0, ${this.config.height})`)
          .attr('class', 'gridX')
          .call(this.makeGridlinesX(x));
      } else {
        d3.select('.gridX')
          .transition()
          .duration(200)
          .style('stroke-opacity', 1e-6)
          .transition()
          .duration(300)
          .call(this.makeGridlinesX(x))
          .style('stroke-opacity', 0.7);
      }
    }

    // If specified, add label to the X Axis
    if (xAxisOptions.label.visible) {
      if (d3.select('.labelX').empty()) {
        this.svg.append('text')
          .attr('class', 'labelX')
          .attr('transform',
            `translate(${(this.config.width / 2)},
            ${this.config.height + this.config.margin.bottom})`)
          .attr('text-anchor', 'middle')
          .text(xAxisOptions.label.value);
      } else {
        d3.select('.labelX')
          .text(xAxisOptions.label.value);
      }
    }

    // If specified, rotate the tick labels
    if (xAxisOptions.tickLabels.rotated) {
      d3.selectAll('g.x.axis g.tick text')
        .style('text-anchor', 'middle')
        .attr('dx', '-.8em')
        .attr('dy', '.55em')
        .attr('transform', 'rotate(-25)');
    }

    // If specified, hide the X axis line
    if (!xAxisOptions.line.visible) {
      d3.selectAll('.x.axis path')
        .attr('style', 'display: none;');
    }

    // If specified, hide the X axis ticks
    if (!xAxisOptions.ticks.visible) {
      d3.selectAll('.x.axis line')
        .attr('style', 'display: none;');
    }

    // If specified, hide the X axis tick labels
    if (!xAxisOptions.tickLabels.visible) {
      d3.selectAll('.x.axis g.tick text')
        .attr('style', 'display: none;');
    }

    // Create the scale for the Y Axis
    const y = d3[this.config.axis.y.scaleType]()
      .range([this.config.height, 0])
      .domain([0, d3.max(data, d => _.get(d, this.keyY))]);

    // Create the Y Axis
    const yAxis = d3.axisLeft(y)
      .ticks(yAxisOptions.ticks.number)
      .tickSizeOuter(0);

    // Add the Y Axis to the container element
    if (d3.select('.y.axis').empty()) {
      this.svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis);
    } else {
      d3.select('.y.axis')
        .transition()
        .duration(550)
        .call(yAxis);
    }

    // If specified, add gridlines along the Y axis
    if (yAxisOptions.gridlines) {
      const gridlinesY = d3.axisLeft(y)
        .ticks(yAxisOptions.ticks.number)
        .tickFormat(yAxisOptions.ticks.format)
        .tickSize(-this.config.width);

      if (d3.select('.gridY').empty()) {
        this.svg.append('g')
          .attr('class', 'gridY')
          .call(gridlinesY);
      } else {
        d3.select('.gridY')
          .transition()
          .duration(200)
          .style('stroke-opacity', 1e-6)
          .transition()
          .duration(300)
          .style('stroke-opacity', 0.7);
      }
    }

    // If specified, add label to the Y Axis
    if (yAxisOptions.label.visible) {
      if (d3.select('.labelY').empty()) {
        this.svg.append('text')
          .attr('class', 'labelY')
          .attr('transform',
            `translate(${-this.config.margin.right - 28},
            ${(this.config.height / 2) - this.config.margin.top})rotate(-90)`)
          .attr('text-anchor', 'middle')
          .attr('dy', '.70em')
          .text(yAxisOptions.label.value);
      } else {
        d3.select('.labelY')
          .text(yAxisOptions.label.value);
      }
    }

    // If specified, hide the Y axis line
    if (!yAxisOptions.line.visible) {
      d3.selectAll('.y.axis path')
        .attr('style', 'display: none;');
    }

    // If specified, hide the Y axis ticks
    if (!yAxisOptions.ticks.visible) {
      d3.selectAll('.y.axis line')
        .attr('style', 'display: none;');
    }

    // If specified, hide the Y axis tick labels
    if (!yAxisOptions.tickLabels.visible) {
      d3.selectAll('.y.axis g.tick text')
        .attr('style', 'display: none;');
    }

    const bars = d3.select('.container').select('g').selectAll('.bar');
    if (bars.empty()) {
      bars
        .data(data)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(_.get(d, this.keyX)))
        .attr('y', this.config.height)
        .attr('width', x.bandwidth())
        .attr('height', 0)
        .transition()
        .duration(350)
        .delay(150)
        .attr('y', d => y(_.get(d, this.keyY)))
        .attr('height', d => this.config.height - y(_.get(d, this.keyY)));
    } else {
      // Remove old data that is not present in the new data set
      bars
        .data(data)
        .exit()
        .transition()
        .duration(350)
        .delay(100)
        .attr('y', y(0))
        .attr('height', this.config.height - y(0))
        .style('fill-opacity', 1e-6)
        .remove();

      // Add new data that was not present in the old data set
      bars
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(_.get(d, this.keyX)))
        .attr('y', this.config.height)
        .attr('width', x.bandwidth())
        .attr('height', 0)
        .transition()
        .duration(350)
        .delay(100)
        .attr('y', d => y(_.get(d, this.keyY)))
        .attr('height', d => this.config.height - y(_.get(d, this.keyY)));

      // Update data that was present in the old data set
      bars
        .data(data)
        .transition()
        .duration(500)
        .attr('x', d => x(_.get(d, this.keyX)))
        .attr('y', d => y(_.get(d, this.keyY)))
        .attr('width', x.bandwidth())
        .attr('height', d => this.config.height - y(_.get(d, this.keyY)));
    }
    return this.svg;
  }
}

export default BarGraph;
