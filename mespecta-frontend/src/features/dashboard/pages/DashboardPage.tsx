import { useEffect, useState } from "react";
import { Card, Row, Col, Segmented, DatePicker, Button, Typography, Table, Space, Tag, Skeleton, Alert } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import type { Dayjs } from "dayjs";
import { getDashboard } from "../dashboard.api";
import type { DashboardData, DashboardPeriod } from "../dashboard.types";
import { formatNumberIt, formatHoursIt, formatDateIt } from "../../../utils/formatItalian";

const { Text } = Typography;
const { RangePicker } = DatePicker;

const SectionHeader = ({ children }: { children: string }) => (
  <div style={{ margin: "28px 0 14px" }}>
    <Text style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#1677ff" }}>
      {children}
    </Text>
    <div style={{ height: 1, background: "#e8f0fe", marginTop: 6 }} />
  </div>
);

const Field = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div>
    <Text type="secondary" style={{ fontSize: 11, display: "block", marginBottom: 2, textTransform: "uppercase", letterSpacing: 0.5 }}>
      {label}
    </Text>
    <Text style={{ fontSize: 18, fontWeight: 700 }}>{value ?? "-"}</Text>
  </div>
);

const KpiCard = ({
  label,
  value,
  color,
  loading,
}: {
  label: string;
  value: React.ReactNode;
  color?: string;
  loading?: boolean;
}) => (
  <Card style={{ borderRadius: 12 }} styles={{ body: { padding: "16px 20px" } }}>
    {loading ? (
      <Skeleton active paragraph={false} title={{ width: "60%" }} />
    ) : (
      <>
        <Text type="secondary" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>
          {label}
        </Text>
        <div style={{ fontSize: 26, fontWeight: 700, color: color ?? "#1f2937", marginTop: 4 }}>{value}</div>
      </>
    )}
  </Card>
);

const BarRow = ({ label, value, display, max }: { label: string; value: number; display: string; max: number }) => {
  const pct = max ? (value / max) * 100 : 0;
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
        <Text>{label}</Text>
        <Text strong>{display}</Text>
      </div>
      <div style={{ height: 7, background: "#f0f0f0", borderRadius: 4 }}>
        <div style={{ height: 7, width: `${pct}%`, background: "#1677ff", borderRadius: 4, transition: "width .3s" }} />
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const [period, setPeriod] = useState<DashboardPeriod>("Monthly");
  const [customRange, setCustomRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [refetching, setRefetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  const fetchDashboard = async () => {
    try {
      if (!data) setLoading(true);
      else setRefetching(true);
      setError(null);

      const params = customRange
        ? { fromDate: customRange[0].format("YYYY-MM-DD"), toDate: customRange[1].format("YYYY-MM-DD") }
        : { period };

      const result = await getDashboard(params);
      setData(result);
      setLastRefreshed(new Date());
    } catch {
      setError("Failed to load dashboard.");
    } finally {
      setLoading(false);
      setRefetching(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period, customRange]);

  const contentStyle = { opacity: refetching ? 0.5 : 1, transition: "opacity .2s", pointerEvents: refetching ? ("none" as const) : ("auto" as const) };

  const leatherTypes = data?.cites.topLeatherTypes ?? [];
  const maxSkins = Math.max(1, ...leatherTypes.map((l) => l.totalSkins));

  const craftsmen = [...(data?.craftsmen ?? [])].sort((a, b) => b.productionsInPeriod - a.productionsInPeriod);
  const maxProductionsInPeriod = Math.max(1, ...craftsmen.map((c) => c.productionsInPeriod));

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto" }}>
      {/* ── TOP BAR ── */}
      <Row justify="space-between" align="middle" wrap style={{ marginBottom: 8, gap: 12 }}>
        <Col>
          <Text style={{ fontSize: 22, fontWeight: 700 }}>Dashboard</Text>
        </Col>

        <Col>
          <Space wrap>
            <Segmented
              value={customRange ? undefined : period}
              onChange={(val) => {
                setCustomRange(null);
                setPeriod(val as DashboardPeriod);
              }}
              options={["Daily", "Weekly", "Monthly"]}
            />

            <RangePicker
              value={customRange}
              onChange={(dates) => {
                if (dates && dates[0] && dates[1]) setCustomRange([dates[0], dates[1]]);
                else setCustomRange(null);
              }}
            />

            {customRange && <Tag color="blue">Custom range</Tag>}

            <Text type="secondary" style={{ fontSize: 12 }}>
              {lastRefreshed ? `Last refreshed: ${lastRefreshed.toLocaleTimeString("it-IT")}` : ""}
            </Text>

            <Button icon={<ReloadOutlined />} onClick={fetchDashboard} loading={refetching}>
              Refresh
            </Button>
          </Space>
        </Col>
      </Row>

      {data && (
        <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 8 }}>
          {formatDateIt(data.fromDate)} → {formatDateIt(data.toDate)}
        </Text>
      )}

      {error && (
        <Alert
          type="error"
          showIcon
          message={error}
          action={
            <Button size="small" danger onClick={fetchDashboard}>
              Retry
            </Button>
          }
          style={{ marginBottom: 16, borderRadius: 8 }}
        />
      )}

      <div style={contentStyle}>
        {/* ── CITES ── */}
        <SectionHeader>CITES</SectionHeader>

        <Row gutter={16}>
          <Col span={6}>
            <KpiCard label="Total Inbounds" value={formatNumberIt(data?.cites.totalInbounds)} loading={loading} />
          </Col>
          <Col span={6}>
            <KpiCard label="Total Skins" value={formatNumberIt(data?.cites.totalSkins)} loading={loading} />
          </Col>
          <Col span={6}>
            <KpiCard
              label="Inbounds in Period"
              value={formatNumberIt(data?.cites.inboundsInPeriod)}
              color="#1677ff"
              loading={loading}
            />
          </Col>
          <Col span={6}>
            <KpiCard
              label="Skins in Period"
              value={formatNumberIt(data?.cites.skinsInPeriod)}
              color="#1677ff"
              loading={loading}
            />
          </Col>
        </Row>

        <Card title="Top Leather Types" style={{ marginTop: 16, borderRadius: 12 }} loading={loading}>
          <Table
            size="small"
            rowKey="leatherTypeName"
            pagination={false}
            dataSource={leatherTypes}
            locale={{ emptyText: "No data for this period" }}
            columns={[
              { title: "Leather Type", dataIndex: "leatherTypeName" },
              {
                title: "Inbounds",
                dataIndex: "inboundCount",
                width: 110,
                align: "right" as const,
                render: (v: number) => formatNumberIt(v),
              },
              {
                title: "Skins",
                dataIndex: "totalSkins",
                width: 260,
                render: (v: number) => <BarRow label="" value={v} display={formatNumberIt(v)} max={maxSkins} />,
              },
            ]}
          />
        </Card>

        {/* ── PRODUCTIONS ── */}
        <SectionHeader>Productions</SectionHeader>

        <Row gutter={16}>
          <Col span={8}>
            <KpiCard label="In Progress" value={formatNumberIt(data?.productions.inProgress)} color="#1677ff" loading={loading} />
          </Col>
          <Col span={8}>
            <KpiCard label="Paused" value={formatNumberIt(data?.productions.paused)} color="#faad14" loading={loading} />
          </Col>
          <Col span={8}>
            <KpiCard label="Completed" value={formatNumberIt(data?.productions.completed)} color="#52c41a" loading={loading} />
          </Col>
        </Row>

        <Row gutter={16} style={{ marginTop: 16 }}>
          <Col span={12}>
            <KpiCard label="In Stock" value={formatNumberIt(data?.productions.inStock)} color="#722ed1" loading={loading} />
          </Col>
          <Col span={12}>
            <KpiCard label="Sold" value={formatNumberIt(data?.productions.sold)} color="#13a8a8" loading={loading} />
          </Col>
        </Row>

        <Card title="Period Activity" style={{ marginTop: 16, borderRadius: 12 }} loading={loading}>
          <Row gutter={32}>
            <Col span={8}>
              <Field label="Started in Period" value={formatNumberIt(data?.productions.startedInPeriod)} />
            </Col>
            <Col span={8}>
              <Field label="Completed in Period" value={formatNumberIt(data?.productions.completedInPeriod)} />
            </Col>
            <Col span={8}>
              <Field label="Hours in Period" value={formatHoursIt(data?.productions.hoursInPeriod)} />
            </Col>
          </Row>
        </Card>

        {/* ── CRAFTSMEN ── */}
        <SectionHeader>Craftsmen Production</SectionHeader>

        <Card style={{ borderRadius: 12 }} loading={loading}>
          <Table
            size="small"
            rowKey="craftsmanId"
            pagination={false}
            dataSource={craftsmen}
            locale={{ emptyText: "No data for this period" }}
            columns={[
              { title: "Craftsman", dataIndex: "fullName" },
              {
                title: "In Period (#)",
                dataIndex: "productionsInPeriod",
                align: "right" as const,
                render: (v: number) => formatNumberIt(v),
              },
              {
                title: "Hours (Period)",
                dataIndex: "hoursInPeriod",
                align: "right" as const,
                render: (v: number) => formatHoursIt(v),
              },
              {
                title: "Total (#)",
                dataIndex: "totalProductions",
                align: "right" as const,
                render: (v: number) => formatNumberIt(v),
              },
              {
                title: "Total Hours",
                dataIndex: "totalHours",
                align: "right" as const,
                render: (v: number) => formatHoursIt(v),
              },
              {
                title: "Now Working",
                dataIndex: "currentlyInProgress",
                align: "center" as const,
                render: (v: number) =>
                  v > 0 ? (
                    <Space size={6}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#52c41a", display: "inline-block" }} />
                      {v}
                    </Space>
                  ) : (
                    <Text type="secondary">—</Text>
                  ),
              },
            ]}
          />
        </Card>

        {craftsmen.length > 0 && (
          <Card title="Productions per Craftsman in Period" style={{ marginTop: 16, borderRadius: 12 }} loading={loading}>
            {craftsmen.map((c) => (
              <BarRow
                key={c.craftsmanId}
                label={c.fullName}
                value={c.productionsInPeriod}
                display={formatNumberIt(c.productionsInPeriod)}
                max={maxProductionsInPeriod}
              />
            ))}
          </Card>
        )}
      </div>
    </div>
  );
}
