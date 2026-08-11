-- PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  organization TEXT,
  qualification TEXT,
  experience_years NUMERIC NOT NULL DEFAULT 0,
  primary_role TEXT,
  skills TEXT[] NOT NULL DEFAULT '{}',
  languages TEXT[] NOT NULL DEFAULT '{}',
  interests TEXT[] NOT NULL DEFAULT '{}',
  availability TEXT,
  portfolio_url TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  onboarded BOOLEAN NOT NULL DEFAULT false,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  show_email BOOLEAN NOT NULL DEFAULT false,
  email_notifications BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_visible" ON public.profiles FOR SELECT TO authenticated USING (is_visible OR id = auth.uid());
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE INDEX idx_profiles_location ON public.profiles (lower(location));
CREATE INDEX idx_profiles_primary_role ON public.profiles (lower(primary_role));
CREATE INDEX idx_profiles_skills ON public.profiles USING GIN (skills);
CREATE INDEX idx_profiles_languages ON public.profiles USING GIN (languages);

-- CERTIFICATIONS
CREATE TABLE public.certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  issuer TEXT,
  year INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.certifications TO authenticated;
GRANT ALL ON public.certifications TO service_role;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "certs_select" ON public.certifications FOR SELECT TO authenticated USING (true);
CREATE POLICY "certs_write_own" ON public.certifications FOR ALL TO authenticated USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());
CREATE INDEX idx_certifications_profile ON public.certifications (profile_id);

-- CONNECTIONS
CREATE TABLE public.connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','rejected','blocked')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT no_self_connection CHECK (sender_id <> receiver_id),
  CONSTRAINT unique_pair UNIQUE (sender_id, receiver_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.connections TO authenticated;
GRANT ALL ON public.connections TO service_role;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "connections_select_own" ON public.connections FOR SELECT TO authenticated USING (sender_id = auth.uid() OR receiver_id = auth.uid());
CREATE POLICY "connections_insert_sender" ON public.connections FOR INSERT TO authenticated WITH CHECK (sender_id = auth.uid());
CREATE POLICY "connections_update_party" ON public.connections FOR UPDATE TO authenticated USING (sender_id = auth.uid() OR receiver_id = auth.uid()) WITH CHECK (sender_id = auth.uid() OR receiver_id = auth.uid());
CREATE POLICY "connections_delete_sender" ON public.connections FOR DELETE TO authenticated USING (sender_id = auth.uid());
CREATE INDEX idx_connections_sender ON public.connections (sender_id);
CREATE INDEX idx_connections_receiver ON public.connections (receiver_id);

-- CONVERSATIONS
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  last_message_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE public.conversation_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (conversation_id, user_id)
);
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  read_at TIMESTAMPTZ
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.conversations TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.conversation_members TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.messages TO authenticated;
GRANT ALL ON public.conversations, public.conversation_members, public.messages TO service_role;

CREATE OR REPLACE FUNCTION public.is_conversation_member(_conversation_id UUID, _user_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.conversation_members WHERE conversation_id = _conversation_id AND user_id = _user_id);
$$;

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "conv_select_member" ON public.conversations FOR SELECT TO authenticated USING (public.is_conversation_member(id, auth.uid()));
CREATE POLICY "conv_insert_own" ON public.conversations FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
CREATE POLICY "conv_update_member" ON public.conversations FOR UPDATE TO authenticated USING (public.is_conversation_member(id, auth.uid())) WITH CHECK (public.is_conversation_member(id, auth.uid()));

CREATE POLICY "cm_select_member" ON public.conversation_members FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_conversation_member(conversation_id, auth.uid()));
CREATE POLICY "cm_insert_creator" ON public.conversation_members FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.conversations c WHERE c.id = conversation_id AND c.created_by = auth.uid()));

CREATE POLICY "messages_select_member" ON public.messages FOR SELECT TO authenticated USING (public.is_conversation_member(conversation_id, auth.uid()));
CREATE POLICY "messages_insert_member" ON public.messages FOR INSERT TO authenticated WITH CHECK (sender_id = auth.uid() AND public.is_conversation_member(conversation_id, auth.uid()));
CREATE POLICY "messages_update_member" ON public.messages FOR UPDATE TO authenticated USING (public.is_conversation_member(conversation_id, auth.uid())) WITH CHECK (public.is_conversation_member(conversation_id, auth.uid()));
CREATE INDEX idx_messages_conversation ON public.messages (conversation_id, created_at DESC);
CREATE INDEX idx_cm_user ON public.conversation_members (user_id);

-- NOTIFICATIONS
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  reference_id UUID,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notif_select_own" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "notif_update_own" ON public.notifications FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "notif_delete_own" ON public.notifications FOR DELETE TO authenticated USING (user_id = auth.uid());
CREATE INDEX idx_notifications_user ON public.notifications (user_id, created_at DESC);

-- TRIGGERS
CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_connections_updated BEFORE UPDATE ON public.connections FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''), NEW.raw_user_meta_data->>'avatar_url')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.notify_connection() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE sender_name TEXT; receiver_name TEXT;
BEGIN
  SELECT COALESCE(NULLIF(full_name,''),'Someone') INTO sender_name FROM public.profiles WHERE id = NEW.sender_id;
  SELECT COALESCE(NULLIF(full_name,''),'Someone') INTO receiver_name FROM public.profiles WHERE id = NEW.receiver_id;
  IF TG_OP = 'INSERT' AND NEW.status = 'pending' THEN
    INSERT INTO public.notifications (user_id, type, title, message, reference_id)
    VALUES (NEW.receiver_id, 'connection_request', 'New connection request', sender_name || ' wants to connect with you.', NEW.sender_id);
  ELSIF TG_OP = 'UPDATE' AND NEW.status = 'accepted' AND OLD.status <> 'accepted' THEN
    INSERT INTO public.notifications (user_id, type, title, message, reference_id)
    VALUES (NEW.sender_id, 'connection_accepted', 'Connection accepted', receiver_name || ' accepted your connection request.', NEW.receiver_id);
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER trg_notify_connection AFTER INSERT OR UPDATE ON public.connections FOR EACH ROW EXECUTE FUNCTION public.notify_connection();

CREATE OR REPLACE FUNCTION public.notify_message() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE sender_name TEXT; other UUID;
BEGIN
  SELECT COALESCE(NULLIF(full_name,''),'Someone') INTO sender_name FROM public.profiles WHERE id = NEW.sender_id;
  UPDATE public.conversations SET last_message_at = NEW.created_at WHERE id = NEW.conversation_id;
  FOR other IN SELECT user_id FROM public.conversation_members WHERE conversation_id = NEW.conversation_id AND user_id <> NEW.sender_id LOOP
    INSERT INTO public.notifications (user_id, type, title, message, reference_id)
    VALUES (other, 'message', 'New message', 'You have a new message from ' || sender_name || '.', NEW.conversation_id);
  END LOOP;
  RETURN NEW;
END; $$;
CREATE TRIGGER trg_notify_message AFTER INSERT ON public.messages FOR EACH ROW EXECUTE FUNCTION public.notify_message();

-- REALTIME
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER TABLE public.connections REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.connections;

-- STORAGE POLICIES FOR AVATARS
CREATE POLICY "avatars_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "avatars_insert_own" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "avatars_update_own" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "avatars_delete_own" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);