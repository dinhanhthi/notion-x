'use client'

import mermaid from 'mermaid'
import React from 'react'

mermaid.initialize({
  startOnLoad: true,
  theme: 'default',
  securityLevel: 'loose'
})

export default class Mermaid extends React.Component<{ chart: string }> {
  componentDidMount() {
    mermaid.contentLoaded()
  }
  render() {
    // Class "mermaid" is required by mermaid
    return <div className="mermaid flex justify-center">{this.props.chart}</div>
  }
}
