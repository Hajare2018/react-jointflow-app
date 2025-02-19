import ContentCard from '../../../components/Contents/ContentCard/ContentCard';

export default function ContentTab({ contents }) {
  return (
    <div className="w-full">
      {contents.map((content) => (
        <ContentCard
          key={content.id}
          content={content}
        />
      ))}
    </div>
  );
}
