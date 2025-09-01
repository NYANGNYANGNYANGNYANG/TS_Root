CREATE TABLE TS_default (
  TS_id SERIAL PRIMARY KEY,
  requester_id TEXT NOT NULL,
  ip_address TEXT,
  log_trace_id TEXT,
  requester_name VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  request_type VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL,
  priority VARCHAR(10),
  assigned_to VARCHAR(50),
  category VARCHAR(50) NOT NULL,
  access_control_level VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  received_at TIMESTAMP,
  updated_at TIMESTAMP,
  completed_at TIMESTAMP,
  notified_email BOOLEAN,
  notified_in_app BOOLEAN
);

CREATE TABLE TS_attachments (
  attachment_id SERIAL PRIMARY KEY,
  TS_id INTEGER NOT NULL REFERENCES TS_default(TS_id) ON DELETE CASCADE,
  attachment_path VARCHAR(255),
  attachment_size INTEGER,
  attachment_type VARCHAR(20)
);

CREATE TABLE TS_notifications (
  notification_id SERIAL PRIMARY KEY,
  TS_id INTEGER NOT NULL REFERENCES TS_default(TS_id) ON DELETE CASCADE,
  notify_type VARCHAR(20) NOT NULL,
  notify_status VARCHAR(20) NOT NULL,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  recipient VARCHAR(100)
);

CREATE INDEX idx_TS_status ON TS_default(status);
CREATE INDEX idx_TS_category ON TS_default(category);
CREATE INDEX idx_TS_requester_id ON TS_default(requester_id);
CREATE INDEX idx_TS_created_at ON TS_default(created_at DESC);
CREATE INDEX idx_TS_assigned_to ON TS_default(assigned_to);
CREATE INDEX idx_attachments_TS_id ON TS_attachments(TS_id);

