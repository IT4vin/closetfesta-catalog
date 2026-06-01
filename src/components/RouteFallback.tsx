const RouteFallback = () => (
  <div
    className="flex min-h-[50vh] flex-col items-center justify-center gap-3 bg-background px-6"
    role="status"
    aria-live="polite"
    aria-label="Carregando página"
  >
    <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    <p className="font-body text-sm text-muted-foreground">Carregando…</p>
  </div>
);

export default RouteFallback;
