import * as React from 'react';

declare const google: any;
declare const window: any;

interface Props {
  zoom?: number;
  markerTitle?: string;
  center: {lat: number, lon: number}
}

export class Map extends React.Component<Props> {
  static defaultProps = { zoom: 12 };

  private container: HTMLDivElement | null;
  private map: any;
  private marker: any;

  componentDidMount() {
    this.map = new google.maps.Map(this.container, {center: this.center, zoom: this.props.zoom});
    if(this.props.markerTitle) {
      this.marker = new google.maps.Marker({map: this.map, position: this.center, title: this.props.markerTitle});
    }
    window.map = this.map;
  }

  render() {
    const {zoom, center} = this.props;
    const coordinate = {lat: center.lat, lng: center.lon};
    const {map, marker} = this;
    return (
      <div className="map" ref={(el) => this.container = el}/>
    )
  }

  private get center() {
    const center = this.props.center;
    return {lat: center.lat, lng: center.lon};
  }
}