export default function AiThinking() {
  return (
    <div className="my-auto flex justify-center gap-1.5">
      <div
        className="bg-primary h-3 w-3 animate-bounce rounded-full opacity-80"
        style={{ animationDelay: '0s' }}
      />
      <div
        className="bg-primary h-3 w-3 animate-bounce rounded-full opacity-80"
        style={{ animationDelay: '0.2s' }}
      />
      <div
        className="bg-primary h-3 w-3 animate-bounce rounded-full opacity-80"
        style={{ animationDelay: '0.4s' }}
      />
    </div>
  );
}
