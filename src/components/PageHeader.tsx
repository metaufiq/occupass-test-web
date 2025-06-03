interface Props {
  title?: string;
  desc?: string;
}

const PageHeader = ({title, desc}: Props) => {
  return (
      <header className="mb-8">
        <h2 className="text-4xl font-bold text-foreground mb-3 tracking-tight">{title}</h2>
        <p className="text-muted-foreground text-lg">{desc}</p>
      </header>
  );
}

export default PageHeader;