
ALTER TABLE public.stories REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.stories;
