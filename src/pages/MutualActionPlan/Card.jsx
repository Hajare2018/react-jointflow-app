import clsx from 'clsx';

export default function Card(props) {
  const { title, className, children, titleAction } = props;

  return (
    <div className={clsx('shadow-sm border rounded p-4', className)}>
      <div className="flex justify-between items-center pb-4">
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
        {titleAction}
      </div>
      <div>{children}</div>
    </div>
  );
}
