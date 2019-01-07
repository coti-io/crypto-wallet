import React, { Component } from 'react';

class GradientSVG extends Component {
    render() {
      let { startColor, endColor, idCSS, rotation , middleColor } = this.props;
  
      let gradientTransform = `rotate(${rotation})`;
  
      return (
        <svg style={{ height: 0 }}>
          <defs>
            <linearGradient id={idCSS} gradientTransform="rotate(90)" >
              <stop offset="0%" stopColor={startColor} />
              <stop offset="35%" stopColor={middleColor} />
              <stop offset="100%" stopColor={endColor} />
            </linearGradient>
          </defs>
        </svg>
      );
    }
  }
  
  export default GradientSVG;