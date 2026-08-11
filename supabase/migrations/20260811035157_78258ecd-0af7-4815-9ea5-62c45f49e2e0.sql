REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.notify_connection() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.notify_message() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.is_conversation_member(UUID, UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_conversation_member(UUID, UUID) TO authenticated;