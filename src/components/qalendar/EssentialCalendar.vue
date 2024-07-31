<template>
  <div class="col-12">
    <Qalendar
      :selected-date="new Date()"
      :events="events"
      :config="config"
      @event-was-clicked="$emit('clicked-event', $event)"
      @event-was-dragged="$emit('dragged-event')"
      @event-was-resized="$emit('resized-event')"
      @edit-event="$emit('edit-event')"
      @delete-event="$emit('delete-event')"
    />
  </div>
</template>

<script src="./EssentialCalendar.ts" />

<style>
@import 'qalendar/dist/style.css';
</style>
