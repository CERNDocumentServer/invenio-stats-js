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

// Export default configuration object
const config = {};

// For keyType : other
config.other = {
  graph: {
    type: 'groupedBar'
  },
  margin: {
    top: 50,
    right: 40,
    bottom: 70,
    left: 60
  },
  axis: {
    x: {
      mapTo: 'term',
      scale: {
        type: 'scaleBand',
        format: null
      },
      options: {
        label: {
          value: 'Country',
          visible: false
        },
        line: {
          visible: false
        },
        ticks: {
          visible: false
        },
        tickLabels: {
          visible: true,
          rotated: false
        },
        gridlines: false
      }
    },
    y: {
      mapTo: 'count',
      scale: {
        type: 'scaleLinear',
        format: ''
      },
      options: {
        label: {
          value: 'Count',
          visible: true
        },
        line: {
          visible: false
        },
        ticks: {
          visible: false
        },
        tickLabels: {
          visible: true,
          rotated: false
        },
        gridlines: true
      }
    }
  },
  title: {
    value: 'Statistics per Country',
    visible: true
  },
  colorScale: 'schemeCategory20',
  tooltip: {
    enabled: true
  },
  legend: {
    visible: true,
    position: 'bottom'
  },
  resize: {
    enabled: true,
    breakPointX: 550,
    breakPointY: 275
  }
};

export default config;
