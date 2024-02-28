import { Calendar } from '@fullcalendar/core'
import interactionPlugin from '@fullcalendar/interaction'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import multiMonthPlugin from '@fullcalendar/multimonth'
import scrollGridPlugin from '@fullcalendar/scrollgrid'
import timelinePlugin from '@fullcalendar/timeline'
import adaptivePlugin from '@fullcalendar/adaptive'
import resourcePlugin from '@fullcalendar/resource'
import resourceDayGridPlugin from '@fullcalendar/resource-daygrid'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid'
import rrulePlugin from '@fullcalendar/rrule'
import momentPlugin from '@fullcalendar/moment'
import momentTimezonePlugin from '@fullcalendar/moment-timezone'
import locales from '@fullcalendar/core/locales-all'

export default function fullcalendar({
    locale,
    plugins,
    schedulerLicenseKey,
    timeZone,
    config,
    editable,
    selectable,    
}) {
    return {
        init() {
            console.log("Init");
            let cellsData;
            let htmlTemplate;

            /** @type Calendar */
            const calendar = new Calendar(this.$el, {
                headerToolbar: {
                    'left': 'prev,next today',
                    'center': 'title',
                    'right': 'dayGridMonth,dayGridWeek,dayGridDay',
                },
                plugins: plugins.map(plugin => availablePlugins[plugin]),
                locale,
                schedulerLicenseKey,
                timeZone,
                editable,
                selectable,
                ...config,
                locales,                  
                events: (info, successCallback, failureCallback) => {
                    this.$wire.fetchEvents({ start: info.startStr, end: info.endStr, timezone: info.timeZone })
                        .then(successCallback)
                        .catch(failureCallback)

                        this.$wire.getCellTemplate()
                        .then((data) => {
                            //console.log("HTML LOAD",data);
                            htmlTemplate = data;                            
                        })
                        .catch(failureCallback)

                        this.$wire.fetchCellsData({ start: info.startStr, end: info.endStr, timezone: info.timeZone })
                        .then((data) => {
                            //console.log("DATA LOAD",data);
                            cellsData = data;
                            calendar.render()
                        })
                        .catch(failureCallback)


                        

                },
                eventClick: ({ event, jsEvent }) => {
                    jsEvent.preventDefault()

                    console.log(event, jsEvent);
                    if (event.url) {
                        const isNotPlainLeftClick = e => (e.which > 1) || (e.altKey) || (e.ctrlKey) || (e.metaKey) || (e.shiftKey)
                        return window.open(event.url, (event.extendedProps.shouldOpenUrlInNewTab || isNotPlainLeftClick(jsEvent)) ? '_blank' : '_self')
                    }

                    this.$wire.onEventClick(event)
                },
                eventDrop: async ({ event, oldEvent, relatedEvents, delta, oldResource, newResource, revert }) => {
                    const shouldRevert = await this.$wire.onEventDrop(event, oldEvent, relatedEvents, delta, oldResource, newResource)

                    if (typeof shouldRevert === 'boolean' && shouldRevert) {
                        revert()
                    }
                },
                eventResize: async ({ event, oldEvent, relatedEvents, startDelta, endDelta, revert }) => {
                    const shouldRevert = await this.$wire.onEventResize(event, oldEvent, relatedEvents, startDelta, endDelta)

                    if (typeof shouldRevert === 'boolean' && shouldRevert) {
                        revert()
                    }
                },
                dateClick: ( info ) => {

                    let id = (info.date.getMonth()+1) + 
                    "_" + info.date.getDate();

                    if ((cellsData != undefined) && 
                        (cellsData[id] != undefined))
                    {
                        console.log("NODATA",cellsData[id]);
                    }

                    this.$wire.onDateClick(cellsData[id].id, info)
                },
                select: ({ startStr, endStr, allDay, view, resource }) => {
                    if (!selectable) return;
                    //this.$wire.onDateSelect(startStr, endStr, allDay, view, resource)
                },
                dayCellContent: (dayData) => { 

                    var innerBlock = document.createElement("div");
                    innerBlock.setAttribute('class','calCellTopCnt')

                    let id = (dayData.date.getMonth()+1) + 
                        "_" + dayData.date.getDate();

                    let template = htmlTemplate;

                    if ((cellsData != undefined) && 
                        (cellsData[id] != undefined))
                    {

                        template = template
                        .replace('{{dayNumber}}', dayData.dayNumberText);

                        Object.keys(cellsData[id]).map(function(k) {
                            template = template
                            .replace('{{'+k+'}}', cellsData[id][k]);
                        });

                        innerBlock.innerHTML = template;

                    }

                    return {domNodes:[innerBlock]};
                },

            })

            calendar.render()

            window.addEventListener('filament-fullcalendar--refresh', () => calendar.refetchEvents())
        },
    }
}

const availablePlugins = {
    'interaction': interactionPlugin,
    'dayGrid': dayGridPlugin,
    'timeGrid': timeGridPlugin,
    'list': listPlugin,
    'multiMonth': multiMonthPlugin,
    'scrollGrid': scrollGridPlugin,
    'timeline': timelinePlugin,
    'adaptive': adaptivePlugin,
    'resource': resourcePlugin,
    'resourceDayGrid': resourceDayGridPlugin,
    'resourceTimeline': resourceTimelinePlugin,
    'resourceTimeGrid': resourceTimeGridPlugin,
    'rrule': rrulePlugin,
    'moment': momentPlugin,
    'momentTimezone': momentTimezonePlugin,
}
