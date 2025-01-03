import ical from 'ical/ical.js';
import useFetch from './swr.js';
import { Fragment, useMemo, useState } from 'react';
import { compareAsc, format, isThisMonth } from 'date-fns';
import { bg } from 'date-fns/locale';

function App() {
  const {
      data,
      isLoading,
      error,
  } = useFetch('https://initlab.org/events.ics');

  const [ selectedEventIds, setSelectedEventIds ] = useState(new Set());

  const {
      events,
  } = useMemo(function() {
      if (!data) {
          return {
              events: [],
          };
      }

      const parsed = ical.parseICS(data);
      const events = Object.values(parsed).filter(item => item.type === 'VEVENT').sort((a, b) =>
          compareAsc(a.start, b.start)
      );

      setSelectedEventIds(() => new Set(events.filter(event => isThisMonth(event.start)).map(event => event.uid)));

      return {
          events,
      };
  }, [data]);

  const selectedEvents = useMemo(() => events.filter(event =>
      selectedEventIds.has(event.uid)
  ), [events, selectedEventIds]);

  function addEvent(uid) {
      setSelectedEventIds(prev => new Set([...prev, uid]));
  }

  function removeEvent(uid) {
      setSelectedEventIds(prev => new Set([...prev].filter(x => x !== uid)));
  }

  function onEventChange(e) {
      if (e.target.checked) {
          addEvent(e.target.value);
      }
      else {
          removeEvent(e.target.value);
      }
  }

  return (<>
    {isLoading && <p>Loading iCal...</p>}
    {error && <p>Error loading iCal: {error.message}</p>}
    {data && <>
        <p>Loaded {events.length} events from iCal</p>
        <ul>
            {events.map(event => <li key={event.uid}>
                <label>
                    <input type="checkbox" value={event.uid} checked={selectedEventIds.has(event.uid)} onChange={onEventChange} />
                    [{format(event.start, 'dd.MM.yyyy HH:mm')}] {event.summary}
                </label>
            </li>)}
        </ul>
        <div style={{
            display: 'inline-block',
            border: '1px solid #000',
            padding: '10px',
            fontFamily: 'Arial, Verdana, Tahoma, Helvetica, sans-serif',
        }}>
            <p>Ахой!</p>
            <p>
                <strong>Предстоящи събития в лаба:</strong><br />
                {selectedEvents.length === 0 && '- още не е планирано нищо'}
                {selectedEvents.map(event => <Fragment key={event.uid}>
                    - {format(event.start, 'd MMMM (EEEE) от HH:mm', {
                        locale: bg,
                    })} - <a href={event.url}>{event.summary}</a><br />
                </Fragment>)}
            </p>
            <p>
                <strong>Новини:</strong><br />
                - заредили сме различни видове Club Mate и неща за хрупане
            </p>
            <p>
                <strong>Обяви:</strong><br />
                - няма нови, може да видите актуалните обяви тук: <a href="https://initlab.org/category/listings/">
                https://initlab.org/category/listings/</a>
            </p>
            <p>
                <strong>Искаш да ни подкрепиш?</strong><br />
                - <a href="https://initlab.org/%D0%B7%D0%B0-%D0%BD%D0%B0%D1%81/%D0%BF%D1%80%D0%B8%D1%81%D1%8A%D0%B5%D0%B4%D0%B8%D0%BD%D0%B8-%D1%81%D0%B5/">стани член</a><br />
                - организирай събитие или курс - пиши ни на <a href="mailto:us@initlab.org">us@initlab.org</a> с идеята си!<br />
                - <a href="https://initlab.org/%d0%b7%d0%b0-%d0%bd%d0%b0%d1%81/%d0%b4%d0%b0%d1%80%d0%b5%d0%bd%d0%b8%d1%8f/">подари ни нещо</a><br />
                - разкажи на някого за нас<br />
                - <a href="https://github.com/initlab/initlab/issues/">помогни ни с текущите проекти, задачи и проблеми на Лаба</a>
            </p>
            <p>
                <strong>Спонсори, дарители и Patreon подкрепчици от последния месец:</strong><br />
                - М.А.<br />
                - Я.С.<br />
                - N.A.<br />
                - TheCherveno<br />
                - Velina
            </p>
            <p>Благодарим ви!</p>
        </div>
    </>}
  </>);
}

export default App;
