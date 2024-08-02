<template>
    <div>
        <Qalendar 
            :events="events"
            :config="config"
        />
        <button @click="addEvent">Add Event</button>
        <button @click="editEvent('753944708f0f')">Edit Event</button>
        <button @click="deleteEvent('753944708f0f')">Delete Event</button>
    </div>
</template>

<script>
import { Qalendar } from "qalendar";

export default {
    components: {
        Qalendar,
    },

    data() {
        return {
            events: [
                {
                    title: "Advanced algebra",
                    with: "Chandler Bing",
                    time: { start: "2022-05-16 12:05", end: "2022-05-16 13:35" },
                    color: "yellow",
                    isEditable: true,
                    id: "753944708f0f",
                    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores assumenda corporis doloremque et expedita molestias necessitatibus quam quas temporibus veritatis. Deserunt excepturi illum nobis perferendis praesentium repudiandae saepe sapiente voluptatem!"
                },
                {
                    title: "Ralph on holiday",
                    with: "Rachel Greene",
                    time: { start: "2022-05-10", end: "2022-05-22" },
                    color: "green",
                    isEditable: true,
                    id: "5602b6f589fc"
                }
            ],
            config: {
                // Configuración de Qalendar
            }
        }
    },

    methods: {
        addEvent() {
            const newEvent = {
                title: "New Event",
                with: "John Doe",
                time: { start: "2022-06-01 09:00", end: "2022-06-01 10:00" },
                color: "blue",
                isEditable: true,
                id: Math.random().toString(36).substr(2, 9),
                description: "This is a new event."
            };
            this.events.push(newEvent);
        },

        editEvent(eventId) {
            const event = this.events.find(event => event.id === eventId);
            if (event) {
                event.title = "Edited Event Title";
                event.time.start = "2022-06-01 10:00";
                event.time.end = "2022-06-01 11:00";
                event.color = "red";
            }
        },

        deleteEvent(eventId) {
            this.events = this.events.filter(event => event.id !== eventId);
        }
    }
}
</script>

<style>
@import "qalendar/dist/style.css";
</style>