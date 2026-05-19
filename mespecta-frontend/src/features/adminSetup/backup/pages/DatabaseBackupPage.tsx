import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Table,
  Modal,
  Radio,
  Space,
  Typography,
  Tag,
  message,
} from "antd";
import {
  DatabaseOutlined,
  DownloadOutlined,
  DeleteOutlined,
  CloudServerOutlined,
} from "@ant-design/icons";
import api from "../../../../services/api";

const { Text } = Typography;

interface BackupFile {
  fileName: string;
  sizeBytes: number;
  sizeDisplay: string;
  createdAt: string;
  downloadUrl: string;
}

async function downloadBackup(fileName: string) {
  const res = await api.get(`/admin/backup/${encodeURIComponent(fileName)}/download`, {
    responseType: "blob",
  });
  const url = URL.createObjectURL(res.data);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

export default function DatabaseBackupPage() {
  const [backups, setBackups]           = useState<BackupFile[]>([]);
  const [loading, setLoading]           = useState(false);
  const [backingUp, setBackingUp]       = useState(false);
  const [modalOpen, setModalOpen]       = useState(false);
  const [saveMode, setSaveMode]         = useState<"server" | "both">("server");
  const [deleteTarget, setDeleteTarget] = useState<BackupFile | null>(null);
  const [deleting, setDeleting]         = useState(false);

  // ── Load list ──────────────────────────────────────────────────────────────
  const loadBackups = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/backup");
      setBackups(res.data?.data ?? []);
    } catch {
      // interceptor handles toast
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadBackups(); }, []);

  // ── Backup Now ─────────────────────────────────────────────────────────────
  const handleBackup = async () => {
    try {
      setBackingUp(true);
      const res = await api.post("/admin/backup");
      const file: BackupFile = res.data?.data;

      message.success(res.data?.message || "Backup created successfully");

      if (saveMode === "both" && file?.fileName) {
        await downloadBackup(file.fileName);
      }

      setModalOpen(false);
      loadBackups();
    } catch {
      // interceptor handles toast
    } finally {
      setBackingUp(false);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      const res = await api.delete(`/admin/backup/${encodeURIComponent(deleteTarget.fileName)}`);
      message.success(res.data?.message || "Backup deleted");
      setDeleteTarget(null);
      loadBackups();
    } catch {
      // interceptor handles toast
    } finally {
      setDeleting(false);
    }
  };

  // ── Table columns ──────────────────────────────────────────────────────────
  const columns = [
    {
      title: "File Name",
      dataIndex: "fileName",
      render: (name: string) => (
        <Space>
          <DatabaseOutlined style={{ color: "#1677ff" }} />
          <Text code style={{ fontSize: 12 }}>{name}</Text>
        </Space>
      ),
    },
    {
      title: "Size",
      dataIndex: "sizeDisplay",
      width: 110,
      render: (v: string) => <Tag>{v}</Tag>,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      width: 180,
      render: (v: string) =>
        new Date(v).toLocaleString("en-GB", {
          day: "2-digit", month: "short", year: "numeric",
          hour: "2-digit", minute: "2-digit",
        }),
    },
    {
      title: "",
      align: "right" as const,
      width: 100,
      render: (_: any, record: BackupFile) => (
        <Space>
          <Button
            type="link"
            icon={<DownloadOutlined />}
            size="small"
            onClick={() => downloadBackup(record.fileName)}
          >
            Download
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => setDeleteTarget(record)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      {/* ── Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <Space direction="vertical" size={0}>
          <Text strong style={{ fontSize: 16 }}>
            <CloudServerOutlined style={{ marginRight: 8, color: "#1677ff" }} />
            Database Backups
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Backup files are stored on the server. Download a copy for offsite storage.
          </Text>
        </Space>

        <Button
          type="primary"
          icon={<DatabaseOutlined />}
          loading={backingUp}
          onClick={() => { setSaveMode("server"); setModalOpen(true); }}
        >
          Backup Now
        </Button>
      </div>

      {/* ── Backup table ── */}
      <Table
        rowKey="fileName"
        columns={columns}
        dataSource={backups}
        loading={loading}
        pagination={{ hideOnSinglePage: true, pageSize: 20 }}
        locale={{ emptyText: "No backups yet" }}
        size="middle"
      />

      {/* ── Backup Now modal ── */}
      <Modal
        title={
          <Space>
            <DatabaseOutlined style={{ color: "#1677ff" }} />
            Backup Now
          </Space>
        }
        open={modalOpen}
        onCancel={() => !backingUp && setModalOpen(false)}
        onOk={handleBackup}
        okText="Start Backup"
        confirmLoading={backingUp}
        destroyOnHidden
      >
        <div style={{ padding: "12px 0" }}>
          <Text type="secondary" style={{ display: "block", marginBottom: 16 }}>
            Choose where to save the backup:
          </Text>
          <Radio.Group
            value={saveMode}
            onChange={(e) => setSaveMode(e.target.value)}
          >
            <Space direction="vertical">
              <Radio value="server">
                Save on server only
              </Radio>
              <Radio value="both">
                Save on server <strong>and</strong> download a copy to my computer
              </Radio>
            </Space>
          </Radio.Group>
        </div>
      </Modal>

      {/* ── Delete confirm modal ── */}
      <Modal
        title="Delete Backup"
        open={!!deleteTarget}
        onCancel={() => !deleting && setDeleteTarget(null)}
        onOk={handleDelete}
        okText="Delete"
        okButtonProps={{ danger: true }}
        confirmLoading={deleting}
        destroyOnHidden
      >
        <p>
          Are you sure you want to permanently delete{" "}
          <Text code>{deleteTarget?.fileName}</Text>?
        </p>
        <Text type="secondary">This cannot be undone.</Text>
      </Modal>
    </Card>
  );
}
