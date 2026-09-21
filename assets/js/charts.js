import { generate72HourTrend, generate24HourTrend, generate7DayForecast, getAQIInfo } from './stationData.js';

export class ForecastCharts {
  constructor(canvas72hMultiId = 'chart-24h', canvas7dId = 'chart-7d', canvasRadarId = 'chart-radar', canvasPblId = 'chart-pbl-inversion') {
    this.canvas72hMultiId = canvas72hMultiId;
    this.canvas7dId = canvas7dId;
    this.canvasRadarId = canvasRadarId;
    this.canvasPblId = canvasPblId;
    this.chart72hMulti = null;
    this.chart7d = null;
    this.chartRadar = null;
    this.chartPbl = null;
  }

  getCanvas(id) {
    return document.getElementById(id);
  }

  updateCharts(station, profileData = null, options = {}) {
    if (!station) return;
    if (!window.Chart) {
      console.warn('Chart.js not yet loaded, retrying in 250ms...');
      setTimeout(() => this.updateCharts(station, profileData, options), 250);
      return;
    }

    // During active scrubber playback/scrubbing, update radar fingerprint in-place and keep 72h timelines rock-solid
    if (options.isScrubbing) {
      this.renderRadarChart(station);
      return;
    }

    this.render72HourMultiPollutantChart(station, profileData);
    this.render72HourForecastChart(station, profileData);
    this.renderRadarChart(station);
    if (profileData) {
      this.renderPblInversionChart(profileData);
    }
  }

  // -------------------------------------------------------------
  // 72-Hour Multi-Pollutant & Smoke Dispersion Outlook
  // -------------------------------------------------------------
  render72HourMultiPollutantChart(station, profileData = null) {
    const canvas = this.getCanvas(this.canvas72hMultiId);
    if (!canvas) return;
    const trendData = generate72HourTrend(station.aqi, station.pm25, station.pm10, profileData);
    const ctx = canvas.getContext('2d');
    const isDark = !document.documentElement.classList.contains('light');
    const textColor = isDark ? '#F8FAFC' : '#0F172A';
    const textMuted = isDark ? '#94A3B8' : '#475569';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
    const maxPollutantVal = Math.max(100, ...trendData.pm10, ...trendData.pm25);
    const suggestedYMax = Math.ceil((maxPollutantVal * 1.12) / 20) * 20;

    // In-place update to prevent remounting, glitching and flickering
    if (this.chart72hMulti) {
      this.chart72hMulti.data.labels = trendData.labels;
      this.chart72hMulti.data.datasets[0].data = trendData.pm25;
      this.chart72hMulti.data.datasets[1].data = trendData.pm10;
      this.chart72hMulti.data.datasets[2].data = trendData.stubble;
      
      // Update theme colors in-place
      this.chart72hMulti.options.plugins.legend.labels.color = textColor;
      this.chart72hMulti.options.scales.x.grid.color = gridColor;
      this.chart72hMulti.options.scales.x.ticks.color = textColor;
      this.chart72hMulti.options.scales.x.title.color = textColor;
      this.chart72hMulti.options.scales.y.grid.color = gridColor;
      this.chart72hMulti.options.scales.y.ticks.color = textColor;
      this.chart72hMulti.options.scales.y.title.color = textColor;
      this.chart72hMulti.options.scales.y.suggestedMax = suggestedYMax;

      this.chart72hMulti.update('none');
      return;
    }

    const datasets = [
      {
        label: 'PM2.5 (µg/m³)',
        data: trendData.pm25,
        borderColor: '#9333EA',
        backgroundColor: 'rgba(147, 51, 234, 0.12)',
        borderWidth: 2.6,
        fill: true,
        tension: 0.35,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointBackgroundColor: '#9333EA'
      },
      {
        label: 'PM10 (µg/m³)',
        data: trendData.pm10,
        borderColor: '#0284C7',
        backgroundColor: 'transparent',
        borderWidth: 2.4,
        borderDash: [5, 4],
        tension: 0.35,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointBackgroundColor: '#0284C7'
      },
      {
        label: 'Stubble Smoke Share (%)',
        data: trendData.stubble,
        borderColor: '#DC2626',
        backgroundColor: 'transparent',
        borderWidth: 2.6,
        tension: 0.32,
        yAxisID: 'y1',
        pointRadius: 0,
        pointHoverRadius: 6,
        pointBackgroundColor: '#DC2626'
      }
    ];

    this.chart72hMulti = new Chart(ctx, {
      type: 'line',
      data: {
        labels: trendData.labels,
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: { left: 4, right: 8, top: 4, bottom: 6 }
        },
        animation: { duration: 0 },
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: textColor,
              usePointStyle: true,
              boxWidth: 9,
              boxHeight: 9,
              padding: 14,
              font: { family: 'Inter', size: 12, weight: '700' }
            }
          },
          tooltip: {
            backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.98)',
            titleColor: isDark ? '#F8FAFC' : '#0F172A',
            bodyColor: isDark ? '#E2E8F0' : '#1E293B',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.12)',
            borderWidth: 1,
            padding: 12,
            boxPadding: 6,
            usePointStyle: true,
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) label += ': ';
                if (context.parsed.y !== null) {
                  label += context.parsed.y;
                  if (context.dataset.yAxisID === 'y1') label += '%';
                  else label += ' µg/m³';
                }
                return label;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { color: gridColor },
            ticks: {
              color: textColor,
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: 7,
              padding: 8,
              font: { family: 'Inter', size: 11, weight: '600' }
            },
            title: {
              display: true,
              text: 'Forecast Timeline (Next 72 Hours)',
              color: textMuted,
              font: { family: 'Inter', size: 11, weight: '600' },
              padding: { top: 6 }
            }
          },
          y: {
            position: 'left',
            beginAtZero: true,
            suggestedMax: suggestedYMax,
            grid: { color: gridColor },
            ticks: {
              color: textColor,
              padding: 8,
              font: { family: 'Inter', size: 11, weight: '700' }
            },
            title: {
              display: true,
              text: 'Particulate (µg/m³)',
              color: textColor,
              font: { family: 'Inter', size: 11.5, weight: '700' },
              padding: { bottom: 6 }
            }
          },
          y1: {
            position: 'right',
            min: 0,
            max: 50,
            grid: { drawOnChartArea: false },
            ticks: {
              color: isDark ? '#F87171' : '#DC2626',
              stepSize: 10,
              padding: 8,
              callback: (val) => val + '%',
              font: { family: 'Inter', size: 11, weight: '700' }
            },
            title: {
              display: true,
              text: 'Smoke Share (%)',
              color: isDark ? '#F87171' : '#DC2626',
              font: { family: 'Inter', size: 11.5, weight: '700' },
              padding: { bottom: 6 }
            }
          }
        }
      }
    });
  }

  // -------------------------------------------------------------
  // 72-Hour Coupled AQI Forecast with Inversion-Driven Uncertainty Band
  // -------------------------------------------------------------
  render72HourForecastChart(station, profileData = null) {
    const canvas = this.getCanvas(this.canvas7dId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const isDark = !document.documentElement.classList.contains('light');
    const textColor = isDark ? '#F8FAFC' : '#0F172A';
    const textMuted = isDark ? '#94A3B8' : '#475569';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';

    const count = 72;
    const labels = [];
    const meanAqi = [];
    const upperConfidence = [];
    const lowerConfidence = [];
    const invData = [];
    const now = new Date();

    for (let i = 0; i < count; i++) {
      const t = new Date(now.getTime() + i * 3600 * 1000);
      const hour = t.getHours();
      const hourStr = `${hour.toString().padStart(2, '0')}:00`;
      const dayStr = t.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' });
      const labelStr = (i % 6 === 0 || i === 0) ? [hourStr, dayStr] : [hourStr, ''];
      labels.push(labelStr);

      const invVal = (profileData && profileData.inversionIndices && profileData.inversionIndices[i] !== undefined)
        ? profileData.inversionIndices[i]
        : ((hour >= 20 || hour <= 8) ? 1.4 : -2.5);
      invData.push(invVal);

      // Baseline projection
      let diurnal = 1.0;
      if (hour >= 6 && hour <= 9) diurnal = 1.25;
      else if (hour >= 20 && hour <= 23) diurnal = 1.22;
      else if (hour >= 13 && hour <= 16) diurnal = 0.82;

      // Inversion impact on mean forecast
      const invImpact = invVal > 0 ? (invVal * 12) : (invVal * 5);
      const baseProjected = Math.round(Math.max(25, Math.min(480, (station.aqi * diurnal * 0.9) + invImpact + (Math.sin(i / 4) * 8))));
      meanAqi.push(baseProjected);

      // Uncertainty band widens significantly during strong inversion (thermal cap volatility)
      const uncertaintyDelta = invVal >= 0 
        ? Math.round(35 + (invVal * 16) + (i * 0.4))  // Widened band when inversion traps pollutants
        : Math.round(15 + (i * 0.3));                  // Narrow band under clean convective mixing

      upperConfidence.push(Math.min(500, baseProjected + uncertaintyDelta));
      lowerConfidence.push(Math.max(20, baseProjected - Math.round(uncertaintyDelta * 0.85)));
    }

    const confidenceRanges = lowerConfidence.map((low, i) => [low, upperConfidence[i]]);

    // In-place update to prevent remounting, glitching and flickering
    if (this.chart7d) {
      this.chart7d.data.labels = labels;
      this.chart7d.data.datasets[0].data = confidenceRanges;
      this.chart7d.data.datasets[1].data = meanAqi;
      this.chart7d.data.datasets[2].data = invData;

      // Update theme colors in-place
      this.chart7d.options.plugins.legend.labels.color = textColor;
      this.chart7d.options.scales.x.grid.color = gridColor;
      this.chart7d.options.scales.x.ticks.color = textColor;
      this.chart7d.options.scales.x.title.color = textColor;
      this.chart7d.options.scales.y.grid.color = gridColor;
      this.chart7d.options.scales.y.ticks.color = textColor;
      this.chart7d.options.scales.y.title.color = textColor;

      this.chart7d.update('none');
      return;
    }

    this.chart7d = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            type: 'bar',
            label: 'Confidence Envelope (Min - Max)',
            data: confidenceRanges,
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.18)' : 'rgba(226, 232, 240, 0.85)',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.4)' : '#CBD5E1',
            borderWidth: 1.2,
            borderRadius: 2,
            grouped: false,
            barPercentage: 0.85,
            categoryPercentage: 0.85,
            order: 2
          },
          {
            type: 'bar',
            label: 'Projected AQI Mean',
            data: meanAqi,
            backgroundColor: '#F97316',
            borderColor: '#EA580C',
            borderWidth: 1,
            borderRadius: 2,
            grouped: false,
            barPercentage: 0.52,
            categoryPercentage: 0.85,
            order: 1
          },
          {
            type: 'line',
            label: 'Inversion ΔT (°C)',
            data: invData,
            borderColor: '#16A34A',
            backgroundColor: 'transparent',
            borderWidth: 2.2,
            borderDash: [4, 4],
            tension: 0.35,
            yAxisID: 'y1',
            pointRadius: (c) => (c.dataIndex % 6 === 0 ? 3 : 0),
            pointBackgroundColor: '#16A34A',
            order: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: { left: 4, right: 8, top: 4, bottom: 6 }
        },
        animation: { duration: 0 },
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            position: 'top',
            labels: { color: textColor, font: { family: 'Inter', size: 12, weight: '700' }, usePointStyle: true, boxWidth: 9, boxHeight: 9, padding: 14 }
          },
          tooltip: {
            backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.98)',
            titleColor: isDark ? '#F8FAFC' : '#0F172A',
            bodyColor: isDark ? '#E2E8F0' : '#1E293B',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.12)',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: (context) => {
                if (context.datasetIndex === 0) {
                  const raw = context.raw;
                  if (Array.isArray(raw)) {
                    return `Confidence Envelope: ${raw[0]} – ${raw[1]} AQI`;
                  }
                  return `Confidence Envelope: ${context.formattedValue} AQI`;
                }
                if (context.datasetIndex === 1) {
                  const val = context.parsed.y;
                  return `Projected AQI Mean: ${val} (${getAQIInfo(val).label})`;
                }
                if (context.datasetIndex === 2) {
                  const val = context.parsed.y;
                  return `Inversion ΔT: ${val > 0 ? '+' : ''}${val} °C`;
                }
                return `${context.dataset.label}: ${context.parsed.y}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { color: gridColor },
            ticks: { color: textColor, maxTicksLimit: 7, maxRotation: 0, padding: 8, font: { family: 'Inter', size: 11, weight: '600' } },
            title: { display: true, text: 'Forecast Timeline (Next 72 Hours)', color: textMuted, font: { family: 'Inter', size: 11, weight: '600' }, padding: { top: 6 } }
          },
          y: {
            position: 'left',
            grid: { color: gridColor },
            ticks: { color: textColor, stepSize: 100, padding: 8, font: { family: 'Inter', size: 11, weight: '700' } },
            title: { display: true, text: 'Coupled 72h AQI Level', color: textColor, font: { family: 'Inter', size: 11.5, weight: '700' }, padding: { bottom: 6 } },
            min: 0,
            max: 500
          },
          y1: {
            position: 'right',
            grid: { drawOnChartArea: false },
            ticks: { color: isDark ? '#34D399' : '#16A34A', padding: 8, callback: (v) => `${v > 0 ? '+' : ''}${v}°C`, font: { family: 'Inter', size: 11, weight: '700' } },
            title: { display: true, text: 'Inversion ΔT (°C)', color: isDark ? '#34D399' : '#16A34A', font: { family: 'Inter', size: 11.5, weight: '700' }, padding: { bottom: 6 } }
          }
        }
      }
    });
  }

  // -------------------------------------------------------------
  // Boundary Layer Height (PBL) & Trapping Threshold Panel Chart
  // -------------------------------------------------------------
  renderPblInversionChart(profileData) {
    const canvas = this.getCanvas(this.canvasPblId);
    if (!canvas || !profileData) return;
    const ctx = canvas.getContext('2d');
    const isDark = !document.documentElement.classList.contains('light');
    const textColor = isDark ? '#F8FAFC' : '#0F172A';
    const textMuted = isDark ? '#94A3B8' : '#475569';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';

    const count = Math.min(72, profileData.labels.length);
    const pblData = profileData.pblHeights.slice(0, count);
    const invData = profileData.inversionIndices.slice(0, count);
    const thresholdData = new Array(count).fill(500); // 500m trapping limit

    const pblGradient = ctx.createLinearGradient(0, 0, 0, 220);
    pblGradient.addColorStop(0, 'rgba(6, 182, 212, 0.35)');
    pblGradient.addColorStop(1, 'rgba(6, 182, 212, 0.02)');

    // In-place update to prevent remounting, glitching and flickering
    if (this.chartPbl) {
      this.chartPbl.data.labels = profileData.labels.slice(0, count);
      this.chartPbl.data.datasets[0].data = pblData;
      this.chartPbl.data.datasets[1].data = thresholdData;
      this.chartPbl.data.datasets[2].data = invData;

      // Update theme colors in-place
      this.chartPbl.options.plugins.legend.labels.color = textColor;
      this.chartPbl.options.scales.x.grid.color = gridColor;
      this.chartPbl.options.scales.x.ticks.color = textColor;
      this.chartPbl.options.scales.x.title.color = textColor;
      this.chartPbl.options.scales.y.grid.color = gridColor;
      this.chartPbl.options.scales.y.ticks.color = textColor;
      this.chartPbl.options.scales.y.title.color = textColor;

      this.chartPbl.update('none');
      return;
    }

    this.chartPbl = new Chart(ctx, {
      type: 'line',
      data: {
        labels: profileData.labels.slice(0, count),
        datasets: [
          {
            label: 'Boundary Layer Height (PBL)',
            data: pblData,
            borderColor: '#0284C7',
            backgroundColor: pblGradient,
            borderWidth: 2.4,
            fill: true,
            tension: 0.35,
            pointRadius: (c) => (c.dataIndex % 6 === 0 ? 3 : 0),
            pointBackgroundColor: '#0284C7'
          },
          {
            label: 'Trapping Risk Threshold (500m)',
            data: thresholdData,
            borderColor: '#DC2626',
            borderWidth: 2,
            borderDash: [5, 4],
            pointRadius: 0,
            fill: false
          },
          {
            label: 'Inversion Index (850hPa - 2m ΔT)',
            data: invData,
            borderColor: '#D97706',
            borderWidth: 2,
            borderDash: [3, 3],
            yAxisID: 'y1',
            pointRadius: 0,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: { left: 4, right: 8, top: 4, bottom: 6 }
        },
        animation: { duration: 0 },
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            position: 'top',
            labels: { color: textColor, font: { family: 'Inter', size: 12, weight: '700' }, usePointStyle: true, boxWidth: 8, padding: 14 }
          },
          tooltip: {
            backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.98)',
            titleColor: isDark ? '#F8FAFC' : '#0F172A',
            bodyColor: isDark ? '#E2E8F0' : '#1E293B',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.12)',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: (context) => {
                if (context.datasetIndex === 0) {
                  const m = context.parsed.y;
                  return `Mixing Layer Height: ${m}m ${m < 500 ? '⚠️ (Trapping Risk)' : '✅ (Good Mixing)'}`;
                }
                if (context.datasetIndex === 2) {
                  return `Inversion ΔT: ${context.parsed.y > 0 ? '+' : ''}${context.parsed.y} °C`;
                }
                return `${context.dataset.label}: ${context.parsed.y}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { color: gridColor },
            ticks: { color: textColor, maxTicksLimit: 7, maxRotation: 0, padding: 8, font: { family: 'Inter', size: 11, weight: '600' } },
            title: { display: true, text: 'Forecast Timeline (Next 72 Hours)', color: textMuted, font: { family: 'Inter', size: 11, weight: '600' }, padding: { top: 6 } }
          },
          y: {
            position: 'left',
            grid: { color: gridColor },
            ticks: { color: textColor, padding: 8, callback: (v) => `${v}m`, font: { family: 'Inter', size: 11, weight: '700' } },
            title: { display: true, text: 'Boundary Layer Height (m)', color: textColor, font: { family: 'Inter', size: 11.5, weight: '700' }, padding: { bottom: 6 } },
            min: 0
          },
          y1: {
            position: 'right',
            grid: { drawOnChartArea: false },
            ticks: { color: isDark ? '#FBBF24' : '#D97706', padding: 8, callback: (v) => `${v > 0 ? '+' : ''}${v}°C`, font: { family: 'Inter', size: 11, weight: '700' } },
            title: { display: true, text: 'Inversion Index (°C)', color: isDark ? '#FBBF24' : '#D97706', font: { family: 'Inter', size: 11.5, weight: '700' }, padding: { bottom: 6 } }
          }
        }
      }
    });
  }

  // -------------------------------------------------------------
  // Pollutant Severity Fingerprint Radar Chart
  // -------------------------------------------------------------
  renderRadarChart(station) {
    const canvas = this.getCanvas(this.canvasRadarId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const isDark = !document.documentElement.classList.contains('light');
    const textColor = isDark ? '#F8FAFC' : '#0F172A';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)';

    // Normalized against safe standard baseline (100 = safety limit)
    const normPm25 = Math.min(500, Math.round((station.pm25 / 60) * 100));
    const normPm10 = Math.min(500, Math.round((station.pm10 / 100) * 100));
    const normNo2 = Math.min(500, Math.round((station.no2 / 80) * 100));
    const normSo2 = Math.min(500, Math.round((station.so2 / 80) * 100));
    const normCo = Math.min(500, Math.round((station.co / 2.0) * 100));
    const normO3 = Math.min(500, Math.round((station.o3 / 100) * 100));

    // In-place update to prevent remounting, glitching and flickering
    if (this.chartRadar) {
      this.chartRadar.data.datasets[0].label = `${station.name} Severity Ratio`;
      this.chartRadar.data.datasets[0].data = [normPm25, normPm10, normNo2, normSo2, normCo, normO3];
      this.chartRadar.options.plugins.legend.labels.color = textColor;
      this.chartRadar.options.scales.r.pointLabels.color = textColor;
      this.chartRadar.options.scales.r.grid.color = gridColor;
      this.chartRadar.options.scales.r.angleLines.color = gridColor;
      this.chartRadar.update('none');
      return;
    }

    this.chartRadar = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['PM2.5 (Fine)', 'PM10 (Coarse)', 'NO₂ (Traffic)', 'SO₂ (Industrial)', 'CO (Combustion)', 'O₃ (Photochemical)'],
        datasets: [
          {
            label: `${station.name} Severity Ratio`,
            data: [normPm25, normPm10, normNo2, normSo2, normCo, normO3],
            backgroundColor: 'rgba(220, 38, 38, 0.35)',
            borderColor: '#DC2626',
            borderWidth: 2.2,
            pointBackgroundColor: '#DC2626',
            pointRadius: 4
          },
          {
            label: 'WHO Safe Standard (100%)',
            data: [100, 100, 100, 100, 100, 100],
            backgroundColor: 'rgba(22, 163, 74, 0.15)',
            borderColor: '#16A34A',
            borderWidth: 2,
            borderDash: [4, 4],
            pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 0 },
        plugins: {
          legend: {
            position: 'top',
            labels: { color: textColor, font: { family: 'Inter', size: 12, weight: '700' }, usePointStyle: true, padding: 14 }
          }
        },
        scales: {
          r: {
            angleLines: { color: gridColor },
            grid: { color: gridColor },
            pointLabels: { color: textColor, font: { family: 'Inter', size: 11, weight: '700' } },
            ticks: { display: false }
          }
        }
      }
    });
  }
}
