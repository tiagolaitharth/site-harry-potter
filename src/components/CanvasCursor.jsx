import useCanvasCursor from '../hooks/useCanvasCursor';
import './CanvasCursor.css';

export default function CanvasCursor() {
  useCanvasCursor();

  return <canvas aria-hidden="true" id="canvas" />;
}
