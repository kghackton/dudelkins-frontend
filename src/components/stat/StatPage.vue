<template>
	<section id="statisticSection" class="d-flex" v-if="loaded">
		<v-col cols="6">
			<v-chart class="chart mt-7" style="height: 100%" :option="sunburstOptions" autoresize />
		</v-col>
		<v-col cols="6">
			<v-chart class="chart" style="height: 100%" :option="barOptions" autoresize />
		</v-col>
	</section>
</template>
<script>
	import { mapActions, mapGetters } from 'vuex'
	import labels from '@/plugins/labels.json'
	import regions from "@/plugins/regions.json"

	import { use } from 'echarts/core'
	import { CanvasRenderer } from 'echarts/renderers'
	import { SunburstChart, LineChart, BarChart } from 'echarts/charts'
	import { TitleComponent, GridComponent, TooltipComponent, LegendComponent, ToolboxComponent } from 'echarts/components'
	import VChart, { THEME_KEY } from 'vue-echarts'

	use([CanvasRenderer, SunburstChart, BarChart, LineChart, TitleComponent, GridComponent, TooltipComponent, LegendComponent, ToolboxComponent])

	const statusColors = {
		GeneralImagesCount: '#FFF',
		GeneralEventsCount: '#3f3f3f',
		Global: '#31c859',
		Incident: '#00693E',
		Fixed: '#C5E384',
		ServiceRequest: '#9ACD32',
		Rejected: '#FF382C',
		Permitted: '#5755d7',
		Waiting: '#FFCD00',
	}

	export default {
		name: 'StatPage',
		components: { VChart },
		provide: { [THEME_KEY]: 'dark' },
		data: (vm) => ({
			loaded: false,
			coreColors: ['#3f3f3f', '#2c2c2c', '#191919'],
			statusColors,
			sunburstOptions: {
				backgroundColor: 'rgba(0,0,0,0)',
				tooltip: {},
				series: [
					{
						type: 'sunburst',
						center: ['50%', '50%'],
						data: [],
						label: {
							rotate: 'radial',
							fontWeight: 'bold',
							minAngle: 5,
							fontSize: 8,
							color: '#2E2733',
						},
						itemStyle: {
							borderColor: '#2E2733',
							borderWidth: 2,
						},
					},
				],
			},
			barOptions: {
				backgroundColor: 'rgba(0,0,0,0)',
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'shadow',
					},
				},
				legend: {},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true,
				},
				xAxis: {
					type: 'value',
				},
				yAxis: {
					type: 'category',
					data: Object.keys(regions),
				},
				series: [
					{
						name: 'Нормально',
						type: 'bar',
						stack: 'total',
						label: {
							show: true,
						},
						emphasis: {
							focus: 'series',
						},
						data: [],
					},
					{
						name: 'Аномально',
						type: 'bar',
						stack: 'total',
						label: {
							show: true,
						},
						emphasis: {
							focus: 'series',
						},
						data: [],
					},
				],
			},
			// lineOptions: {
			//   backgroundColor: '#0100',
			//   tooltip: {
			//     trigger: 'axis',
			//     axisPointer: {
			//       type: 'cross',
			//       label: {
			//         backgroundColor: '#6a7985',
			//       },
			//     },
			//   },
			//   xAxis: [
			//     {
			//       type: 'category',
			//       boundaryGap: false,
			//       data: [],
			//     },
			//   ],
			//   yAxis: [
			//     {
			//       type: 'value',
			//     },
			//   ],
			//   series: [
			//     {
			//       name: 'Не подтверждено',
			//       type: 'line',
			//       itemStyle: { color: statusColors.Rejected },
			//       emphasis: {
			//         focus: 'series',
			//       },
			//       data: [],
			//     },
			//     {
			//       name: 'Типовая ситуация',
			//       type: 'line',
			//       itemStyle: { color: statusColors.Permitted },
			//       emphasis: {
			//         focus: 'series',
			//       },
			//       data: [],
			//     },
			//     {
			//       name: 'Ожидает подтверждения',
			//       type: 'line',
			//       itemStyle: { color: statusColors.Waiting },
			//       emphasis: {
			//         focus: 'series',
			//       },
			//       data: [],
			//     },
			//     {
			//       name: 'Инцидент',
			//       itemStyle: { color: statusColors.Incident },
			//       type: 'line',
			//       emphasis: {
			//         focus: 'series',
			//       },
			//       data: [],
			//     },
			//     {
			//       name: 'Устранено на момент проверки',
			//       itemStyle: { color: statusColors.Fixed },
			//       type: 'line',
			//       emphasis: {
			//         focus: 'series',
			//       },
			//       data: [],
			//     },
			//     {
			//       name: 'Запрос на обслуживание',
			//       itemStyle: { color: statusColors.ServiceRequest },
			//       type: 'line',
			//       emphasis: {
			//         focus: 'series',
			//       },
			//       data: [],
			//     },
			//   ],
			// },
		}),
		computed: {
			...mapGetters(['STAT', 'STAT_ANOMALY_CLASSES', 'STAT_ANOMALY_CLASSES_HOUR', 'STAT_NORMAL_ABNORMAL']),
		},
		methods: {
			...mapActions(['STAT_ANOMALY_CLASSES_GET', 'STAT_ANOMALY_CLASSES_HOUR_GET', 'STAT_NORMAL_ABNORMAL_GET']),
			convertDate(date) {
				return new Intl.DateTimeFormat('ru', {
					year: 'numeric',
					month: 'short',
					day: 'numeric',
				}).format(new Date(date))
			},
			async loadStat(loadArr = []) {
				this.loaded = false

				await this.STAT_ANOMALY_CLASSES_GET().then(() => this.generateAnomalyClasses())
				await this.STAT_NORMAL_ABNORMAL_GET().then(() => this.generateNormalAbnormalStat())
				// await this.STAT_ANOMALY_CLASSES_HOUR_GET()
				// this.generateLabelsStat()

				this.loaded = true
			},
			generateAnomalyClasses() {
				this.sunburstOptions.series[0].data = []
				const anomalyClasses = this.STAT_ANOMALY_CLASSES
				for (let region in anomalyClasses) {
					const regionStat = {
						name: region,
						label: { color: '#fff' },
						// itemStyle: { color: this.statusColors.GeneralEventsCount },
						children: [],
					}
					for (let district in anomalyClasses[region]) {
						const distStat = {
							name: district,
							label: { color: '#fff' },
							// itemStyle: { sty: this.statusColors.GeneralEventsCount },
							children: [],
						}
						for (let zil in anomalyClasses[region][district]) {
							const zilStat = {
								name: zil,
								label: { color: '#fff' },
								// itemStyle: { color: this.statusColors.GeneralEventsCount },
								children: [],
							}
							for (let abClass in anomalyClasses[region][district][zil]) {
								const abClassStat = {
									name: abClass,
									label: { color: '#fff' },
									// itemStyle: { color: this.statusColors.GeneralEventsCount },
									value: anomalyClasses[region][district][zil][abClass],
								}
								zilStat.children.push(abClassStat)
							}
							distStat.children.push(zilStat)
						}
						regionStat.children.push(distStat)
					}
					this.sunburstOptions.series[0].data.push(regionStat)
				}
				// this.sunburstOptions.series[0].data.forEach((series, i) => series.itemStyle.color = this.coreColors[i%3])
			},
			generateNormalAbnormalStat() {
				const normalAbnormal = this.STAT_NORMAL_ABNORMAL
				for (let region in normalAbnormal) {
					let normalCount = 0
					let abnormalCount = 0
					for (let district in normalAbnormal[region]) {
							normalCount += normalAbnormal[region][district].normal
							abnormalCount += normalAbnormal[region][district].abnormal
					}
					this.barOptions.series[0].data.push(normalCount)
					this.barOptions.series[1].data.push(abnormalCount)
				}
			},
		},
		created() {
			this.loadStat()
		},
	}
</script>

<style>
	#statisticSection {
		height: 100vh;
		background-color: inherit;
		overflow: hidden;
		padding: var(--table-padding-vertical) var(--table-padding-horizontal);
	}
	#statisticToolbar {
		height: 65px !important;
		z-index: 100;
	}
	#statisticToolbar :deep(.v-toolbar__content) {
		display: flex;
		align-items: center;
		justify-content: space-around !important;
		padding: 0 5px;
	}
	#statisticToolbar > .v-toolbar__content > * {
		margin: 0 0.7vw;
	}
	#statisticToolbar .v-input--is-label-active .v-select__selections {
		padding-top: 0.5em;
	}
	.filterSelect {
		max-width: 25%;
		margin-right: 5px;
	}
	.statNum {
		/* padding-left: 25px; */
		font-weight: 700;
		justify-content: center;
	}
	.v-card {
		min-width: 150px;
	}
	.v-card__subtitle {
		padding-bottom: 0;
	}
	.v-card__title {
		padding-top: 3px;
		padding-bottom: 3px;
	}
	.statCard {
		width: 40vw;
		max-height: 40vh;
		padding-top: 5px;
		padding-left: 16px;
		margin: -19px 0 -100px 30px;
		z-index: 5;
		background-color: #272727;
		filter: drop-shadow(0px 0px 4px rgba(100, 255, 218, 0.2)) drop-shadow(0px 0px 24px rgba(255, 255, 255, 0.2));
	}
	.statCartNum {
		height: auto;
	}
	/* .echarts:hover {
		z-index: 10;
	} */
</style>
