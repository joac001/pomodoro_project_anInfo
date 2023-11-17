export default function TaskList({tasks}) {
    // initial state of taskList component with no tasks to display
    if (tasks.length == 0) {
        return <div id="task-list">
            <p>No tasks added</p>
        </div>
    }

    // the map method allows for element creation iterating on the given array
    // key property is needed to avoid a specific compiler warning, is determined by the array's length
    return (
        <div id="task-list">
            {tasks.map((task) => (
                <p key={task.id} id="task-item">{task.title}</p>
            ))}
        </div>
    );
}