import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Task {
  id: number;
  title: string;
  done: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}

type FilterType = 'all' | 'active' | 'done';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  newTaskTitle = '';
  newTaskPriority: 'low' | 'medium' | 'high' = 'medium';
  filter = signal<FilterType>('all');
  tasks = signal<Task[]>([
    { id: 1, title: 'Set up Angular project', done: true, priority: 'high', createdAt: new Date() },
    { id: 2, title: 'Build task manager UI', done: false, priority: 'high', createdAt: new Date() },
    { id: 3, title: 'Write unit tests', done: false, priority: 'medium', createdAt: new Date() },
    { id: 4, title: 'Deploy to production', done: false, priority: 'low', createdAt: new Date() },
  ]);

  filteredTasks = computed(() => {
    const f = this.filter();
    return this.tasks().filter(t =>
      f === 'all' ? true : f === 'active' ? !t.done : t.done
    );
  });

  stats = computed(() => {
    const all = this.tasks();
    return {
      total: all.length,
      done: all.filter(t => t.done).length,
      active: all.filter(t => !t.done).length,
    };
  });

  addTask() {
    const title = this.newTaskTitle.trim();
    if (!title) return;
    this.tasks.update(t => [...t, {
      id: Date.now(),
      title,
      done: false,
      priority: this.newTaskPriority,
      createdAt: new Date()
    }]);
    this.newTaskTitle = '';
  }

  toggleTask(id: number) {
    this.tasks.update(tasks =>
      tasks.map(t => t.id === id ? { ...t, done: !t.done } : t)
    );
  }

  deleteTask(id: number) {
    this.tasks.update(tasks => tasks.filter(t => t.id !== id));
  }

  setFilter(f: FilterType) {
    this.filter.set(f);
  }

  clearDone() {
    this.tasks.update(tasks => tasks.filter(t => !t.done));
  }

  onEnter(event: KeyboardEvent) {
    if (event.key === 'Enter') this.addTask();
  }
}
