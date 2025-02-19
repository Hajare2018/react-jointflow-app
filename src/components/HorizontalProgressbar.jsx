export default function HorizontalProgressbar({ width }) {
  return (
    <div
      style={{
        backgroundColor: 'white',
        height: 10,
        position: 'sticky',
        top: 0,
        left: 0,
        zIndex: 1,
        width: '100%',
      }}
    >
      <div style={{ height: 10, backgroundColor: '#627daf', width }}>&nbsp;</div>
    </div>
  );
}
