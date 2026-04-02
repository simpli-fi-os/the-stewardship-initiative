-- ============================================
-- TSI Storage Buckets
-- Migration 005: Public buckets for member photos and org logos
-- ============================================

INSERT INTO storage.buckets (id, name, public) VALUES ('member-photos', 'member-photos', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('org-logos', 'org-logos', true) ON CONFLICT DO NOTHING;
