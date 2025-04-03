<template>
  <div class="subcontent">
    <navigation-bar
      @today="onToday"
      @prev="onPrev"
      @next="onNext"
    />
    <div class="row justify-center" v-if="calendar_cargado">
      <div style="display: flex; max-width: 800px; width: 100%">
        <q-calendar-month
          ref="refCalendar"
          v-model="selectedDate"
          animated
          bordered
          focusable
          hoverable
          no-active-date
          :day-min-height="60"
          :day-height="0"
          :locale="lang"
          @change="onChange"
          @moved="onMoved"
          @click-date="onClickDate"
          @click-day="onClickDay"
          @click-workweek="onClickWorkweek"
          @click-head-workweek="onClickHeadWorkweek"
          @click-head-day="onClickHeadDay"
        >
          <template #week="{ scope: { week, weekdays } }">
            <span
              v-for="(computedEvent, index) in getWeekEvents(week, weekdays)"
              :key="index"
            >
              <div
                :class="badgeClasses(computedEvent)"
                :style="badgeStyles(computedEvent, week.length)"
                @click="getEvent(computedEvent)"
              >
                <div
                  v-if="computedEvent.event && computedEvent.event.details"
                  class="title q-calendar__ellipsis"
                >
                  {{
                    computedEvent.event.title +
                    (computedEvent.event.time ? " - " + computedEvent.event.time : "")
                  }}
                  <q-tooltip>{{ computedEvent.event.details }}</q-tooltip>
                </div>
              </div>
            </span>
          </template>
        </q-calendar-month>
      </div>
    </div>

  </div>
</template>

<style lang="sass" scoped>
.my-event
  position: relative
  display: inline-flex
  white-space: nowrap
  font-size: 12px
  height: 16px
  max-height: 16px
  margin: 1px 0 0 0
  justify-content: center
  text-overflow: ellipsis
  overflow: hidden
  cursor: pointer

.title
  position: relative
  display: flex
  justify-content: center
  align-items: center
  height: 100%

.my-void-event
  display: inline-flex
  white-space: nowrap
  height: 1px

.text-white
  color: white

.bg-blue
  background: blue

.bg-green
  background: green

.bg-orange
  background: orange

.bg-red
  background: red

.bg-teal
  background: teal

.bg-grey
  background: grey

.bg-purple
  background: purple

.rounded-border
  border-radius: 2px
</style>
<script src="./CalendarioEventos.ts"></script>
