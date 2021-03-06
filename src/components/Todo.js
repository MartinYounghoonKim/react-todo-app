import React from 'react';
import ClassNames from 'classnames';

class Todo extends React.Component {
  componentDidUpdate(prevProps) {
    if(this.props.isEditing && !prevProps.isEditing) {
      this._inputDom.value = this.props.text;
      this._inputDom.focus();
    }
  }

  handleKeyDown = e => {
    const text = e.target.value;
    if(!text || e.keyCode !== 13) {
      return;
    }
    this.props.saveTodo(text);
    e.target.value = '';
  };

  render() {
    const {
      text,
      isDone,
      isEditing,
      deleteTodo,
      startEdit,
      cancelEdit,
      toggleTodo
    } = this.props;
      return (
        <li className={ClassNames('todo-item', {
          editing: isEditing,
          completed: isDone
        })}>
          <button
            className="toggle"
            onClick={toggleTodo}
          />
          <div className="todo-item__view">
            <div
              className="todo-item__view__text"
              onDoubleClick={startEdit}
            >{text}</div>
            <button
              className="todo-item__destroy"
              onClick={deleteTodo}
            />
          </div>
          <input
            type="text"
            className="todo-item__edit"
            ref={ref => {
              this._inputDom = ref;
            }}
            onKeyDown={this.handleKeyDown}
            onBlur={cancelEdit}
          />
        </li>
      );
  }
}

export default Todo;
