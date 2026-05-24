export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`body { background: #fff !important; }`}</style>
      {children}
    </>
  );
}
