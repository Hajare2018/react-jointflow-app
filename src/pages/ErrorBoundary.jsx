import { ErrorOutline } from '@mui/icons-material';
import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(_error, _info) {
    // TODO handle error
    this.setState({ hasError: true });
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;

    if (hasError) {
      return (
        <div className="text-centre">
          <ErrorOutline style={{ color: '#a94442', height: 100, width: 100 }} />
          <h2 style={{ color: '#a94442' }}>We are sorry something went wrong!</h2>
          <strong>Trying to reload this page!</strong>
        </div>
      );
    }
    return children;
  }
}
