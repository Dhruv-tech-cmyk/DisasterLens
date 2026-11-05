import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView, 
  StatusBar,
} from "react-native";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

export default function App() {
  const [activeTab, setActiveTab] = useState<"spatial" | "triage">("spatial");
  const [disasterType, setDisasterType] = useState<string>("flood");
  const [file, setFile] = useState<any | null>(null);
  const [filePre, setFilePre] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any | null>(null);
  
  // Triage state
  const [selectedIncident] = useState({
    id: 1,
    title: "Fire / Burn Incident",
    unit: "Unit 12",
    time: "3m ago",
    severity: "CRITICAL",
    score: "9/10",
    description: "Thermal anomaly detected near critical infrastructure corridor...",
    urgency: "Immediate life & structural threat detected.",
    action: "Dispatch heavy suppression and tactical response teams NOW.",
  });

  // Image Picker Handler
  const pickImage = async (isPre: boolean = false) => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access gallery is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
      const selectedAsset = pickerResult.assets[0];
      const fileObj = {
        uri: selectedAsset.uri,
        name: selectedAsset.uri.split("/").pop() || "satellite_tile.jpg",
        size: selectedAsset.fileSize || 2400000,
      };
      if (isPre) {
        setFilePre(fileObj);
      } else {
        setFile(fileObj);
      }
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setIsLoading(true);

    // Simulate backend API inference matching web dashboard behavior
    setTimeout(() => {
      setResult({
        disaster_type: disasterType,
        impact_ratio: disasterType === "flood" ? 82.5 : disasterType === "wildfire" ? 89.1 : 76.4,
        damage_percentage: 58.3,
        severity: "critical",
        engine_status: "Operational (Cloud Node)",
        pipeline_type:
          disasterType === "flood"
            ? "Single-Image Spectral U-Net"
            : "Siamese Bi-Temporal ResNet34",
        confidence: 94.2,
        processing_time_ms: Math.floor(Math.random() * 150) + 240,
        affected_area_km2: 340,
        timestamp: new Date().toLocaleTimeString("en-GB"),
      });
      setIsLoading(false);
    }, 1400);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#030712" />
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* ── Header Component ── */}
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <View style={styles.iconBox}>
              <ActivityIndicator size="small" color="#3b82f6" />
            </View>
            <View>
              <Text style={styles.headerTitle}>
                DISASTERLENS <Text style={styles.versionText}>v4.2.1</Text>
              </Text>
              <Text style={styles.headerSubtitle}>SPATIAL INTELLIGENCE PLATFORM</Text>
            </View>
          </View>

          {/* Navigation Tabs */}
          <View style={styles.navTabs}>
            <TouchableOpacity
              style={[styles.navTabBtn, activeTab === "spatial" && styles.navTabActive]}
              onPress={() => setActiveTab("spatial")}
            >
              <Feather name="layout" size={12} color={activeTab === "spatial" ? "#fff" : "#94a3b8"} />
              <Text style={[styles.navTabText, activeTab === "spatial" && styles.navTabTextActive]}>Spatial</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.navTabBtn, activeTab === "triage" && styles.navTabActive]}
              onPress={() => setActiveTab("triage")}
            >
              <Ionicons name="shield-outline" size={12} color={activeTab === "triage" ? "#fff" : "#94a3b8"} />
              <Text style={[styles.navTabText, activeTab === "triage" && styles.navTabTextActive]}>Triage</Text>
            </TouchableOpacity>
          </View>
        </View>

        {activeTab === "spatial" ? (
          /* ── Spatial Intelligence Telemetry Inputs ── */
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.row}>
                <Ionicons name="pulse" size={14} color="#3b82f6" />
                <Text style={styles.cardHeaderTitle}>TELEMETRY INPUTS</Text>
              </View>
              <Text style={styles.pipelineBadge}>
                {disasterType === "flood" ? "SINGLE-IMAGE CNN" : "SIAMESE BI-TEMPORAL"}
              </Text>
            </View>

            <Text style={styles.label}>SELECT DISASTER DOMAIN</Text>
            
            {/* Disaster Domain Selector Options */}
            <View style={styles.domainRow}>
              {[
                { id: "flood", label: "🌊 Flood", color: "#3b82f6" },
                { id: "wildfire", label: "🔥 Wildfire", color: "#f97316" },
                { id: "earthquake", label: "🏚️ Earthquake", color: "#f59e0b" },
              ].map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.domainBtn,
                    disasterType === item.id && { borderColor: item.color, backgroundColor: `${item.color}15` },
                  ]}
                  onPress={() => {
                    setDisasterType(item.id);
                    setResult(null);
                  }}
                >
                  <Text style={[styles.domainBtnText, disasterType === item.id && { color: '#fff' }]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Primary Tile Upload Zone (T1 or Single Tile) */}
            <Text style={styles.label}>
              {disasterType === "flood" ? "SATELLITE TILE" : "POST-DISASTER TILE (T1)"}
            </Text>
            <TouchableOpacity
              style={styles.uploadZone}
              onPress={() => pickImage(false)}
            >
              <Feather name="upload-cloud" size={24} color="#3b82f6" />
              <Text style={styles.uploadTitle}>
                {file ? file.name : "Drop post-event tile here"}
              </Text>
              <Text style={styles.uploadSub}>PNG, JPG, TIF · Max 50MB</Text>
            </TouchableOpacity>

            {/* Secondary Baseline Upload Zone for Bi-Temporal Models */}
            {disasterType !== "flood" && (
              <View style={{ marginTop: 12 }}>
                <Text style={[styles.label, { color: "#f59e0b" }]}>PRE-DISASTER BASELINE (T0)</Text>
                <TouchableOpacity
                  style={[styles.uploadZone, styles.uploadZoneAmber]}
                  onPress={() => pickImage(true)}
                >
                  <MaterialCommunityIcons name="image-plus" size={24} color="#f59e0b" />
                  <Text style={[styles.uploadTitle, { color: "#f59e0b" }]}>
                    {filePre ? filePre.name : "Drop baseline pre-event tile here"}
                  </Text>
                  <Text style={styles.uploadSub}>PNG, JPG, TIF · Max 50MB</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Analyze Action Button */}
            <TouchableOpacity
              style={[styles.analyzeBtn, !file && styles.analyzeBtnDisabled]}
              onPress={handleAnalyze}
              disabled={isLoading || !file}
            >
              {isLoading ? (
                <View style={styles.row}>
                  <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />
                  <Text style={styles.analyzeBtnText}>RUNNING AI INFERENCE...</Text>
                </View>
              ) : (
                <View style={styles.row}>
                  <Ionicons name="play" size={14} color="#fff" style={{ marginRight: 6 }} />
                  <Text style={styles.analyzeBtnText}>ANALYZE DISASTER EXTENT</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          /* ── Incident Triage View ── */
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardHeaderTitle}>CRITICAL PRIORITY QUEUE</Text>
              <Text style={styles.redBadge}>● {selectedIncident.severity}</Text>
            </View>
            <Text style={styles.triageTitle}>{selectedIncident.title}</Text>
            <Text style={styles.triageDesc}>{selectedIncident.description}</Text>
            
            <View style={styles.urgencyBox}>
              <Text style={styles.urgencyLabel}>RECOMMENDED ACTION:</Text>
              <Text style={styles.urgencyText}>{selectedIncident.action}</Text>
            </View>
          </View>
        )}

        {/* ── Assessment Report Card Section ── */}
        {result ? (
          <View style={styles.reportCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.reportHeaderTitle}>
                {result.disaster_type.toUpperCase()} ASSESSMENT REPORT
              </Text>
              <Text style={styles.criticalPill}>CRITICAL</Text>
            </View>

            <View style={styles.metricsGrid}>
              <View style={styles.metricBox}>
                <Text style={styles.metricLabel}>Impact Ratio</Text>
                <Text style={styles.metricValueBlue}>{result.impact_ratio.toFixed(1)}%</Text>
                <View style={styles.progressBarTrack}>
                  <View style={[styles.progressBarFill, { width: `${result.impact_ratio}%`, backgroundColor: '#3b82f6' }]} />
                </View>
              </View>

              <View style={styles.metricBox}>
                <Text style={styles.metricLabel}>Damage Extent</Text>
                <Text style={styles.metricValueRed}>{result.damage_percentage.toFixed(1)}%</Text>
                <View style={styles.progressBarTrack}>
                  <View style={[styles.progressBarFill, { width: `${result.damage_percentage}%`, backgroundColor: '#ef4444' }]} />
                </View>
              </View>
            </View>

            <View style={styles.secondaryMetricsRow}>
              <View style={styles.secMetric}>
                <Text style={styles.secLabel}>CONFIDENCE</Text>
                <Text style={styles.secVal}>{result.confidence}%</Text>
              </View>
              <View style={styles.secMetric}>
                <Text style={styles.secLabel}>EST. AREA</Text>
                <Text style={styles.secVal}>{result.affected_area_km2} km²</Text>
              </View>
              <View style={styles.secMetric}>
                <Text style={styles.secLabel}>LATENCY</Text>
                <Text style={styles.secVal}>{result.processing_time_ms}ms</Text>
              </View>
            </View>

            <View style={styles.engineFooter}>
              <View style={styles.greenDot} />
              <Text style={styles.engineText} numberOfLines={1}>
                Engine: {result.engine_status} ({result.pipeline_type})
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.placeholderCard}>
            <Ionicons name="bar-chart-outline" size={32} color="#475569" />
            <Text style={styles.placeholderTitle}>Assessment Report</Text>
            <Text style={styles.placeholderSub}>
              Upload satellite imagery and trigger analysis to view real-time disaster metrics.
            </Text>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#030712" },
  container: { padding: 16, paddingBottom: 40 },
  header: {
    backgroundColor: "rgba(15, 23, 42, 0.8)",
    borderWidth: 1,
    borderColor: "rgba(30, 41, 59, 0.8)",
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
  },
  headerTitleRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  headerTitle: { color: "#f8fafc", fontSize: 15, fontWeight: "bold", letterSpacing: 0.5 },
  versionText: { color: "#3b82f6", fontSize: 11, fontFamily: "monospace" },
  headerSubtitle: { color: "#94a3b8", fontSize: 9, fontFamily: "monospace", letterSpacing: 1 },
  navTabs: { flexDirection: "row", backgroundColor: "#090d16", borderRadius: 10, padding: 3, borderWidth: 1, borderColor: "#1e293b" },
  navTabBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 8, borderRadius: 8 },
  navTabActive: { backgroundColor: "#2563eb", shadowColor: "#2563eb", shadowOpacity: 0.4, shadowRadius: 6 },
  navTabText: { color: "#94a3b8", fontSize: 11, fontWeight: "600", marginLeft: 6 },
  navTabTextActive: { color: "#fff" },
  card: {
    backgroundColor: "#090d16",
    borderWidth: 1,
    borderColor: "rgba(30, 41, 59, 0.8)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  cardHeaderTitle: { color: "#f8fafc", fontSize: 12, fontWeight: "bold", letterSpacing: 1 },
  row: { flexDirection: "row", alignItems: "center" },
  pipelineBadge: { color: "#38bdf8", fontSize: 9, fontFamily: "monospace", backgroundColor: "rgba(56, 189, 248, 0.1)", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, borderWidth: 1, borderColor: "rgba(56, 189, 248, 0.2)" },
  label: { color: "#94a3b8", fontSize: 10, fontWeight: "bold", letterSpacing: 1, marginBottom: 8 },
  domainRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  domainBtn: { flex: 1, paddingVertical: 8, paddingHorizontal: 4, backgroundColor: "#111827", borderRadius: 10, borderWidth: 1, borderColor: "#1f2937", alignItems: "center", marginHorizontal: 3 },
  domainBtnText: { color: "#94a3b8", fontSize: 10, fontWeight: "600", textAlign: "center" },
  uploadZone: { borderWidth: 1, borderColor: "rgba(59, 130, 246, 0.5)", borderStyle: "dashed", borderRadius: 12, padding: 20, alignItems: "center", backgroundColor: "rgba(59, 130, 246, 0.04)" },
  uploadZoneAmber: { borderColor: "rgba(245, 158, 11, 0.5)", backgroundColor: "rgba(245, 158, 11, 0.04)" },
  uploadTitle: { color: "#60a5fa", fontSize: 12, fontWeight: "600", marginTop: 8, textAlign: "center" },
  uploadSub: { color: "#64748b", fontSize: 10, marginTop: 4 },
  analyzeBtn: { backgroundColor: "#2563eb", paddingVertical: 14, borderRadius: 12, alignItems: "center", marginTop: 16, shadowColor: "#2563eb", shadowOpacity: 0.3, shadowRadius: 8 },
  analyzeBtnDisabled: { backgroundColor: "#1e293b" },
  analyzeBtnText: { color: "#fff", fontSize: 12, fontWeight: "bold", letterSpacing: 0.5 },
  reportCard: { backgroundColor: "#090d16", borderWidth: 1, borderColor: "rgba(59, 130, 246, 0.4)", borderRadius: 16, padding: 16, marginBottom: 16 },
  reportHeaderTitle: { color: "#f8fafc", fontSize: 11, fontWeight: "bold", letterSpacing: 0.5 },
  criticalPill: { color: "#f87171", fontSize: 9, fontFamily: "monospace", backgroundColor: "rgba(239, 68, 68, 0.1)", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, borderWidth: 1, borderColor: "rgba(239, 68, 68, 0.3)" },
  metricsGrid: { flexDirection: "row", justifyContent: "space-between", marginVertical: 12 },
  metricBox: { flex: 1, backgroundColor: "#111827", borderRadius: 12, padding: 12, marginHorizontal: 4, borderWidth: 1, borderColor: "#1f2937" },
  metricLabel: { color: "#94a3b8", fontSize: 10, marginBottom: 4 },
  metricValueBlue: { color: "#93c5fd", fontSize: 22, fontWeight: "bold" },
  metricValueRed: { color: "#fca5a5", fontSize: 22, fontWeight: "bold" },
  progressBarTrack: { height: 4, backgroundColor: "#1f2937", borderRadius: 2, marginTop: 8, overflow: "hidden" },
  progressBarFill: { height: "100%", borderRadius: 2 },
  secondaryMetricsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  secMetric: { flex: 1, backgroundColor: "#0b0f19", padding: 8, borderRadius: 8, alignItems: "center", marginHorizontal: 3, borderWidth: 1, borderColor: "#1e293b" },
  secLabel: { color: "#64748b", fontSize: 8, fontFamily: "monospace" },
  secVal: { color: "#f8fafc", fontSize: 13, fontWeight: "bold", marginTop: 2 },
  engineFooter: { flexDirection: "row", alignItems: "center", backgroundColor: "#0b0f19", padding: 10, borderRadius: 8, borderWidth: 1, borderColor: "#1e293b" },
  greenDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#22c55e", marginRight: 8 },
  engineText: { color: "#94a3b8", fontSize: 10, fontFamily: "monospace", flex: 1 },
  placeholderCard: { backgroundColor: "#090d16", borderWidth: 1, borderColor: "rgba(30, 41, 59, 0.8)", borderRadius: 16, padding: 24, alignItems: "center", justifyContent: "center" },
  placeholderTitle: { color: "#94a3b8", fontSize: 13, fontWeight: "bold", marginTop: 8 },
  placeholderSub: { color: "#64748b", fontSize: 11, textAlign: "center", marginTop: 4, maxWidth: 240 },
  triageTitle: { color: "#f8fafc", fontSize: 14, fontWeight: "bold", marginBottom: 6 },
  triageDesc: { color: "#94a3b8", fontSize: 11, lineHeight: 16, marginBottom: 12 },
  urgencyBox: { backgroundColor: "rgba(239, 68, 68, 0.08)", borderWidth: 1, borderColor: "rgba(239, 68, 68, 0.3)", borderRadius: 10, padding: 10 },
  urgencyLabel: { color: "#f87171", fontSize: 9, fontWeight: "bold", marginBottom: 4 },
  urgencyText: { color: "#f8fafc", fontSize: 11, fontWeight: "500" },
  redBadge: { color: "#f87171", fontSize: 10, fontFamily: "monospace" },
});