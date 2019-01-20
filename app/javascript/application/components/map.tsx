import * as React from 'react';

declare const google: any;

interface Props {
  zoom?: number;
  markerTitle?: string;
  center: { lat: number; lon: number };
}

export class Map extends React.Component<Props> {
  public static defaultProps = { zoom: 12 };

  private container: HTMLDivElement | null = null;
  private map: any;

  public componentDidMount() {
    if (!(window as any).google) {
      // offline case
      return;
    }
    this.map = new google.maps.Map(this.container, {
      center: this.center,
      zoom: this.props.zoom,
    });
    if (this.props.markerTitle) {
      // tslint:disable-next-line
      new google.maps.Marker({
        map: this.map,
        position: this.center,
        title: this.props.markerTitle,
      });
    }
  }

  public render() {
    return <div className="map" ref={el => (this.container = el)} />;
  }

  private get center() {
    const center = this.props.center;
    return { lat: center.lat, lng: center.lon };
  }
}
