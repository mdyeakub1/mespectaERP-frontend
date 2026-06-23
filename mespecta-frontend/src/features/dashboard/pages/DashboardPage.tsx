import { useEffect, useState } from "react";
import { Card, Row, Col, Segmented, DatePicker, Button, Typography, Space, Tag, Skeleton, Alert } from "antd";
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

const ColumnChart = ({
  data,
  color,
  emptyText,
}: {
  data: { label: string; value: number; display: string; sub?: string }[];
  color?: string;
  emptyText?: string;
}) => {
  if (data.length === 0) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200 }}>
        <Text type="secondary">{emptyText ?? "No data"}</Text>
      </div>
    );
  }

  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 20, height: 220, padding: "0 8px", overflowX: "auto" }}>
      {data.map((d) => {
        const pct = (d.value / max) * 100;
        return (
          <div
            key={d.label}
            style={{ flex: "1 0 60px", display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end" }}
          >
            <Text strong style={{ fontSize: 13, marginBottom: 6 }}>
              {d.display}
            </Text>
            <div
              style={{
                width: "100%",
                maxWidth: 52,
                height: `${pct}%`,
                minHeight: d.value > 0 ? 4 : 0,
                background: color ?? "#1677ff",
                borderRadius: "6px 6px 0 0",
                transition: "height .3s",
              }}
            />
            <Text style={{ fontSize: 12, marginTop: 8, textAlign: "center" }}>{d.label}</Text>
            {d.sub && (
              <Text type="secondary" style={{ fontSize: 11 }}>
                {d.sub}
              </Text>
            )}
          </div>
        );
      })}
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

  const contentStyle = {
    opacity: refetching ? 0.5 : 1,
    transition: "opacity .2s",
    pointerEvents: refetching ? ("none" as const) : ("auto" as const),
  };

  const leatherChartData = (data?.cites.topLeatherTypes ?? []).map((l) => ({
    label: l.leatherTypeName,
    value: l.totalSkins,
    display: formatNumberIt(l.totalSkins),
    sub: `${formatNumberIt(l.inboundCount)} inbounds`,
  }));

  const craftsmenChartData = [...(data?.craftsmen ?? [])]
    .sort((a, b) => b.productionsInPeriod - a.productionsInPeriod)
    .map((c) => ({
      label: c.fullName,
      value: c.productionsInPeriod,
      display: formatNumberIt(c.productionsInPeriod),
      sub: c.currentlyInProgress > 0 ? "🟢 working" : undefined,
    }));

  const productionActivityData = [
    { label: "Started", value: data?.productions.startedInPeriod ?? 0, display: formatNumberIt(data?.productions.startedInPeriod) },
    { label: "Completed", value: data?.productions.completedInPeriod ?? 0, display: formatNumberIt(data?.productions.completedInPeriod) },
  ];

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
        {/* ── TOP OVERVIEW ── */}
        <Row gutter={16}>
          <Col span={6}>
            <KpiCard label="Total CITES Inbound" value={formatNumberIt(data?.cites.totalInbounds)} color="#1677ff" loading={loading} />
          </Col>
          <Col span={6}>
            <KpiCard label="Total Production" value={formatNumberIt(data?.productions.total)} color="#722ed1" loading={loading} />
          </Col>
          <Col span={6}>
            <KpiCard label="Total Sold" value={formatNumberIt(data?.productions.sold)} color="#13a8a8" loading={loading} />
          </Col>
          <Col span={6}>
            <KpiCard label="Total Stock" value={formatNumberIt(data?.productions.inStock)} color="#fa8c16" loading={loading} />
          </Col>
        </Row>

        {/* ── PRODUCTION GRAPH ── */}
        <SectionHeader>Production Activity</SectionHeader>

        <Card style={{ borderRadius: 12 }} loading={loading}>
          <Row gutter={24} align="middle">
            <Col span={16}>
              <ColumnChart data={productionActivityData} color="#722ed1" />
            </Col>
            <Col span={8}>
              <div style={{ textAlign: "center" }}>
                <Text type="secondary" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Hours in Period
                </Text>
                <div style={{ fontSize: 30, fontWeight: 700, color: "#722ed1", marginTop: 4 }}>
                  {formatHoursIt(data?.productions.hoursInPeriod)}
                </div>
              </div>
            </Col>
          </Row>
        </Card>

        {/* ── LEATHER TYPES + CRAFTSMEN ── */}
        <Row gutter={16} style={{ marginTop: 8 }}>
          <Col span={12}>
            <SectionHeader>CITES Leather Types</SectionHeader>
            <Card style={{ borderRadius: 12 }} loading={loading}>
              <ColumnChart data={leatherChartData} color="#1677ff" emptyText="No leather data for this period" />
            </Card>
          </Col>

          <Col span={12}>
            <SectionHeader>Craftsman Production</SectionHeader>
            <Card style={{ borderRadius: 12 }} loading={loading}>
              <ColumnChart data={craftsmenChartData} color="#52c41a" emptyText="No craftsman data for this period" />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
