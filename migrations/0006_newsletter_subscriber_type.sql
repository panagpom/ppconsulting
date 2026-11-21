ALTER TABLE subscriber ADD COLUMN subscriber_type TEXT
  CHECK (subscriber_type IN ('individual', 'business'));
