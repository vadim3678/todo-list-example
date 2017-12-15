import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  title = 'your ToDo-list';
  todoList: ToDoItem[] = [];
  currentId: number = 0;
  todoForm: FormGroup;
  loading: boolean;

  constructor(private fb: FormBuilder) {
    this.todoForm = this.fb.group({
      arr: this.fb.array([])
    });
  }

  createForm() {
    this.todoForm = this.fb.group({
      arrTodo: this.fb.array([])
    });

    const control = <FormArray>this.todoForm.controls['arrTodo'];
    for (let item of this.todoList) {
      control.push(this.getTodoFormItem(item));
    }
  }

  getTodoFormItem(item: ToDoItem) {
    return this.fb.group({
      id: item.id,
      content: item.content,
      isChecked: item.isFinished,
      isEdit: item.isEdit
    });
  }

  addItem(inputValue: any) {
    if (inputValue == null || inputValue === undefined || inputValue === '') { return; }

    this.loading = true;
    setTimeout(() => {
      this.todoList.unshift({
        content: inputValue,
        id: this.currentId++,
        isEdit: false,
        isFinished: false
      });
      this.todoForm.reset();
      this.createForm();
      this.loading = false;
    }, 500);
  }

  editItem(id: any) {
    this.todoList.find(l => l.id === id).isEdit = true;
    this.todoForm.reset();
    this.createForm();
  }
  removeItem(id: any) {
    this.loading = true;
    setTimeout(() => {

      const idx = this.todoList.findIndex(i => i.id === id);
      this.todoList.splice(idx, 1);
      this.todoForm.reset();
      this.createForm();
      this.loading = false;
    }, 500);
  }
  saveItem(inputValue: any, id: any) {
    this.loading = true;
    setTimeout(() => {
      if (inputValue == null || inputValue === undefined || inputValue === '') { return; }

      const todoItem = this.todoList.find(l => l.id === id);
      todoItem.isEdit = false;
      todoItem.content = inputValue;
      this.todoForm.reset();
      this.createForm();
      this.loading = false;
    }, 500);

  }
  checkItem(id: any) {
    const item = this.todoList.find(l => l.id === id);
    item.isFinished = !item.isFinished;
    const idx = this.todoList.findIndex(i => i.id === item.id);
    this.todoList.splice(idx, 1);

    const firstFinishedIdx = this.todoList.findIndex(l => l.isFinished);

    if (firstFinishedIdx === -1) {
      item.isFinished ? this.todoList.push(item) : this.todoList.unshift(item);
    } else {
      item.isFinished ? this.todoList.splice(firstFinishedIdx, 0, item) : this.todoList.unshift(item);
    }



    this.todoForm.reset();
    this.createForm();
  }

  ngOnInit() {

    this.createForm();
  }

}

export class ToDoItem {
  id: number;
  content: string;
  isFinished: boolean;
  isEdit: boolean;
}
