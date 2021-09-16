import React from "react";
import { Body, Header } from "../../components";

class MyErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Actualiza el estado para que el siguiente renderizado muestre la interfaz de repuesto
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      // Puedes renderizar cualquier interfaz de repuesto
      return (
        <>
          <Header />
          <Body style={{ textAlign: "center" }}>
            Ooops something went wrong. Refresh or go back please.
          </Body>
        </>
      );
    }

    return this.props.children;
  }
}

export default MyErrorBoundary;
