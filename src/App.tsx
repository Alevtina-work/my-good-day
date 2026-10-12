import { useEffect, useState } from 'react'

type Task = {
  id: number
  text: string
  completed: boolean
}

type Mood = {
  id: string
  label: string
  messages: string[]
}

type DayData = {
  date: string
  morningMood: string | null
  tasks: Task[]
  eveningMood: string | null
  isDayFinished: boolean
}

const suggestedTasks = [
  'Выпить стакан воды',
  'Немного погулять',
  'Почитать 10 минут',
  'Сделать паузу',
  'Послушать музыку',
  'Проветрить комнату',
  'Убрать одну небольшую вещь',
  'Ответить на одно сообщение',
  'Сделать что-нибудь для себя',
]

const morningMoods: Mood[] = [
  {
    id: 'bad',
    label: 'не очень',
    messages: [
      'Сегодня можно немного сбавить темп. Не обязательно успевать всё.',
      'Пусть сегодня от тебя требуется ровно столько, сколько сейчас можешь дать.',
      'Не самый лёгкий день — и это нормально. Можно начать с чего-то совсем маленького.',
    ],
  },
  {
    id: 'okay',
    label: 'так себе',
    messages: [
      'Может быть, сегодня не лучший день. Давай просто сделаем его чуть-чуть приятнее.',
      'Не обязательно превращать обычный день в продуктивный. Одного маленького хорошего дела уже достаточно.',
      'Иногда день просто бывает таким. Побудь к себе сегодня немного мягче.',
    ],
  },
  {
    id: 'normal',
    label: 'нормально',
    messages: [
      'Спокойный день тоже хороший день.',
      'Пусть сегодня всё идёт своим темпом.',
      'Кажется, сегодня можно просто жить этот день, не торопясь.',
    ],
  },
  {
    id: 'good',
    label: 'хорошо',
    messages: [
      'Здорово. Пусть это хорошее настроение останется с тобой подольше.',
      'Радостно видеть. Кажется, сегодня есть место для чего-нибудь приятного.',
      'Пусть сегодня найдётся ещё несколько маленьких поводов улыбнуться.',
    ],
  },
  {
    id: 'great',
    label: 'прекрасно',
    messages: [
      'Как здорово. Сохрани это ощущение и сделай сегодня что-нибудь особенно приятное для себя.',
      'Вот это настроение. Пусть сегодняшний день ему соответствует.',
      'Прекрасно. Похоже, сегодня хороший день для маленьких радостей.',
    ],
  },
]

const eveningMoods: Mood[] = [
  {
    id: 'bad',
    label: 'не очень',
    messages: [
      'Не каждый день должен быть хорошим. Ты всё равно дошёл до его конца.',
      'Сегодня могло быть непросто. Не нужно искать в этом что-то хорошее — просто дай себе отдохнуть.',
      'Иногда лучший итог дня — разрешить себе наконец остановиться.',
    ],
  },
  {
    id: 'okay',
    label: 'так себе',
    messages: [
      'Обычный день тоже имеет право быть просто обычным.',
      'Может быть, сегодня было не всё так, как хотелось. Завтра будет новый день.',
      'Ты сделал столько, сколько смог. На сегодня этого достаточно.',
    ],
  },
  {
    id: 'normal',
    label: 'нормально',
    messages: [
      'Спокойный день завершён. Можно выдохнуть и никуда не спешить.',
      'Не каждый день должен быть особенным. Иногда достаточно просто прожить его.',
      'Пусть этот вечер будет тихим и приятным.',
    ],
  },
  {
    id: 'good',
    label: 'хорошо',
    messages: [
      'Хороший день. Надеюсь, сегодня было несколько моментов, которые захотелось запомнить.',
      'Похоже, сегодня получилось немного позаботиться о себе.',
      'Здорово. Теперь можно спокойно закончить день и отдохнуть.',
    ],
  },
  {
    id: 'great',
    label: 'прекрасно',
    messages: [
      'Как здорово закончить день с таким настроением. Сохрани это ощущение.',
      'Похоже, сегодня было много хорошего. Пусть вечер будет таким же тёплым.',
      'Прекрасный итог дня. Можно собой немного погордиться.',
    ],
  },
]

const today = new Date().toISOString().slice(0, 10)

const initialDay: DayData = {
  date: today,
  morningMood: null,
  tasks: [],
  eveningMood: null,
  isDayFinished: false,
}

function getTodayLabel() {
  return new Intl.DateTimeFormat('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date())
}

function getMoodMessage(moods: Mood[], moodId: string) {
  const mood = moods.find((item) => item.id === moodId)

  if (!mood) {
    return ''
  }

  const randomIndex = Math.floor(
    Math.random() * mood.messages.length,
  )

  return mood.messages[randomIndex]
}

function loadDay(): DayData {
  try {
    const saved = localStorage.getItem('my-good-day')

    if (!saved) {
      return initialDay
    }

    const parsed = JSON.parse(saved) as DayData

    if (parsed.date !== today) {
      return initialDay
    }

    return parsed
  } catch {
    return initialDay
  }
}

function App() {
  const [day, setDay] = useState<DayData>(loadDay)
  const [isChoosingTasks, setIsChoosingTasks] = useState(false)
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([])
  const [newTask, setNewTask] = useState('')

  const [morningMessage, setMorningMessage] = useState('')
  const [eveningMessage, setEveningMessage] = useState('')

  const completedTasks = day.tasks.filter(
    (task) => task.completed,
  ).length

  useEffect(() => {
    localStorage.setItem('my-good-day', JSON.stringify(day))
  }, [day])

  function toggleTask(id: number) {
    if (day.isDayFinished) {
      return
    }

    setDay((currentDay) => ({
      ...currentDay,
      tasks: currentDay.tasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task,
      ),
    }))
  }

  function deleteTask(id: number) {
    if (day.isDayFinished) {
      return
    }

    setDay((currentDay) => ({
      ...currentDay,
      tasks: currentDay.tasks.filter((task) => task.id !== id),
    }))
  }

  function selectMorningMood(mood: Mood) {
    if (day.isDayFinished) {
      return
    }

    setDay((currentDay) => ({
      ...currentDay,
      morningMood: mood.id,
    }))

    setMorningMessage(getMoodMessage(morningMoods, mood.id))
  }

  function selectEveningMood(mood: Mood) {
    setDay((currentDay) => ({
      ...currentDay,
      eveningMood: mood.id,
    }))

    setEveningMessage(getMoodMessage(eveningMoods, mood.id))
  }

  function toggleSuggestion(text: string) {
    setSelectedSuggestions((current) =>
      current.includes(text)
        ? current.filter((item) => item !== text)
        : [...current, text],
    )
  }

  function addCustomTask() {
    const text = newTask.trim()

    if (!text) {
      return
    }

    setSelectedSuggestions((current) => [...current, text])
    setNewTask('')
  }

  function finishChoosingTasks() {
    const newTasks: Task[] = selectedSuggestions
      .filter(
        (text) =>
          !day.tasks.some((task) => task.text === text),
      )
      .map((text) => ({
        id: Date.now() + Math.random(),
        text,
        completed: false,
      }))

    setDay((currentDay) => ({
      ...currentDay,
      tasks: [...currentDay.tasks, ...newTasks],
    }))

    setSelectedSuggestions([])
    setNewTask('')
    setIsChoosingTasks(false)
  }

  function openTaskPicker() {
    setSelectedSuggestions([])
    setNewTask('')
    setIsChoosingTasks(true)
  }

  function closeTaskPicker() {
    setSelectedSuggestions([])
    setNewTask('')
    setIsChoosingTasks(false)
  }

  function finishDay() {
    setIsChoosingTasks(false)
    setSelectedSuggestions([])
    setNewTask('')

    setDay((currentDay) => ({
      ...currentDay,
      isDayFinished: true,
    }))

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth',
    })
  }

  return (
    <main className="app">
      <section className="hero">
        <p className="eyebrow">{getTodayLabel()}</p>

        <h1>Мой хороший день</h1>

        <p className="subtitle">
          Маленькие вещи, из которых складывается сегодняшний день.
        </p>
      </section>

      <section className="mood-card morning-card">
        <p className="label">Доброе утро</p>

        <h2>Как ты сегодня?</h2>

        <div className="moods">
          {morningMoods.map((mood) => (
            <button
              key={mood.id}
              className={
                day.morningMood === mood.id ? 'selected' : ''
              }
              onClick={() => selectMorningMood(mood)}
            >
              {mood.label}
            </button>
          ))}
        </div>

        {morningMessage && (
          <p className="mood-message">{morningMessage}</p>
        )}
      </section>

      <section className="day-card">
        <div className="card-header">
          <div>
            <p className="label">Сегодня</p>
            <h2>Что хочется сделать?</h2>
          </div>

          <span className="progress">
            {completedTasks} / {day.tasks.length}
          </span>
        </div>

        {!isChoosingTasks && day.tasks.length === 0 && (
          <div className="empty-state">
            <p>Сегодня пока ничего нет.</p>

            <span>
              Выбери несколько маленьких дел, которые хочется сделать.
            </span>
          </div>
        )}

        {!isChoosingTasks && day.tasks.length > 0 && (
          <div className="tasks">
            {day.tasks.map((task) => (
              <div
                key={task.id}
                className={`task-row ${task.completed ? 'completed' : ''
                  }`}
              >
                <button
                  className="task"
                  onClick={() => toggleTask(task.id)}
                  disabled={day.isDayFinished}
                >
                  <span className="checkbox">
                    {task.completed && '✓'}
                  </span>

                  <span>{task.text}</span>
                </button>

                <button
                  className="delete-button"
                  onClick={() => deleteTask(task.id)}
                  disabled={day.isDayFinished}
                  aria-label={`Удалить: ${task.text}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {!isChoosingTasks && !day.isDayFinished && (
          <button
            className="add-button"
            onClick={openTaskPicker}
          >
            +{' '}
            {day.tasks.length === 0
              ? 'Выбрать дела на сегодня'
              : 'Добавить дело'}
          </button>
        )}

        {isChoosingTasks && (
          <div className="task-picker">
            <div className="picker-header">
              <div>
                <p className="label">Новый день</p>
                <h3>Выбрать дела на сегодня</h3>
              </div>

              <button
                className="close-button"
                onClick={closeTaskPicker}
                aria-label="Закрыть"
              >
                ×
              </button>
            </div>

            <div className="custom-task">
              <input
                type="text"
                value={newTask}
                onChange={(event) =>
                  setNewTask(event.target.value)
                }
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    addCustomTask()
                  }
                }}
                placeholder="Что хочется сделать?"
              />

              <button
                className="custom-task-button"
                onClick={addCustomTask}
              >
                Добавить
              </button>
            </div>

            <p className="suggestions-title">
              Или выбери из предложенных
            </p>

            <div className="suggestions">
              {suggestedTasks.map((suggestion) => {
                const isSelected =
                  selectedSuggestions.includes(suggestion)

                return (
                  <button
                    key={suggestion}
                    className={`suggestion ${isSelected ? 'selected' : ''
                      }`}
                    onClick={() => toggleSuggestion(suggestion)}
                  >
                    <span className="suggestion-checkbox">
                      {isSelected && '✓'}
                    </span>

                    {suggestion}
                  </button>
                )
              })}
            </div>

            <div className="picker-footer">
              <span>
                Выбрано: {selectedSuggestions.length}
              </span>

              <button
                className="done-button"
                onClick={finishChoosingTasks}
              >
                Готово
              </button>
            </div>
          </div>
        )}
      </section>

      {!day.isDayFinished && (
        <section className="finish-day-section">
          <p>
            Когда захочешь закончить сегодняшний день,
            возвращайся сюда.
          </p>

          <button
            className="finish-day-button"
            onClick={finishDay}
          >
            Завершить день
          </button>
        </section>
      )}

      {day.isDayFinished && (
        <section className="mood-card evening-card">
          <p className="label">Вечер</p>

          <h2>Как прошёл твой день?</h2>

          <div className="moods">
            {eveningMoods.map((mood) => (
              <button
                key={mood.id}
                className={
                  day.eveningMood === mood.id ? 'selected' : ''
                }
                onClick={() => selectEveningMood(mood)}
              >
                {mood.label}
              </button>
            ))}
          </div>

          {eveningMessage && (
            <p className="mood-message">{eveningMessage}</p>
          )}

          {day.eveningMood && (
            <p className="day-finished">
              День завершён. Теперь можно отдыхать.
            </p>
          )}
        </section>
      )}

      <button
        className="reset-button"
        onClick={() => {
          localStorage.removeItem('my-good-day')
          window.location.reload()
        }}
      >
        Сбросить день
      </button>

    </main>
  )
}

export default App