import constants from '../constants';
import axios from 'axios';
const ax = axios.create({
  baseURL: 'http://localhost:2403/todos',
  timeout: 1000
});

const todoAction = {
    getTodos: () => dispatch => {
      ax.get('/')
      .then(res => {
        dispatch({
          type: constants.todo.get,
          todos: res.data
        });
      });
    },
    addTodo: text => dispatch => {
      const temporalId = Date.now();
      dispatch({
        type: constants.todo.add_temporal,
        newTodo: {
          id: temporalId,
          text
        }
      });

      ax.post('/', { text })
      .then(res => {
        dispatch({
          type: constants.todo.add_success,
          newTodo: res.data,
          temporalId
        });
      })
      .catch(err => {
        dispatch({
          type: constants.todo.add_failed,
          temporalId
        });
      });
    },
    deleteTodo: id => (dispatch, getState) => {
      const prevTodos = getState().todos;
      dispatch({
        type: constants.todo.delete_temporal,
        id
      });
      ax.delete(`/${id}`)
      .then(() => {
          dispatch({
            type: constants.todo.delete_success
          });
        })
      .catch(err => {
        dispatch({
          type: constants.todo.delete_failed,
          todos: prevTodos
        });
      });
    },
    startEdit: id => ({
      type: constants.todo.startEdit,
      id
    }),
    saveTodo: (id, newText) => dispatch => {
      ax.put(`/${id}`, { text: newText })
      .then(res => {
        dispatch({
          type: constants.todo.save,
          id,
          editedTodo: res.data
        });
      });
    },
    cancelEdit: () => ({
      type: constants.todo.cancelEdit
    }),
    toggleTodo: id => (dispatch, getState) => {
      const newDone = !getState().todos.find(v => v.id === id).isDone;
      ax.put(`/${id}`, { isDone: newDone })
      .then(res => {
        dispatch({
          type: constants.todo.toggle,
          id,
          editedTodo: res.data
        });
      });
    },
    toggleAll: () => (dispatch, getState) => {
      const prevTodos = getState().todos;
      const newDone = !prevTodos.every(v => v.isDone);
      const axArray = prevTodos.map(v =>
        ax.put(`/${v.id}`, { isDone: newDone })
      );
      axios.all(axArray)
      .then(res => {
        dispatch({
          type: constants.todo.toggleAll,
          editedTodos: res.map(v => v.data)
        });
      });
    },
    clearCompleted: () => (dispatch, getState) => {
      const prevTodos = getState().todos;
      const axArray = prevTodos
        .filter(v => v.isDone)
        .map(v => ax.delete(`/${v.id}`));
      axios.all(axArray)
      .then(() => {
        dispatch({
          type: constants.todo.clear
        });
      });
    },
};

export default todoAction;
