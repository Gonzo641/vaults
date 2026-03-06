'use client'

import { useState, useTransition, useEffect } from 'react'
import { createTodo, updateTodoStatus, deleteTodo, updateTodoTitle } from '@/actions/todos'
import { Todo } from '@/types'
import { toast } from 'sonner'
import { Plus, Trash2, Loader2, GripVertical, CheckCircle2, Circle, Clock, Edit2, X, Check } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

type Status = 'todo' | 'in_progress' | 'done';

const COLUMNS: { id: Status; title: string; icon: React.ReactNode; color: string }[] = [
    { id: 'todo', title: 'To Do', icon: <Circle className="w-4 h-4" />, color: 'border-slate-500/30 bg-slate-500/5' },
    { id: 'in_progress', title: 'In Progress', icon: <Clock className="w-4 h-4 text-blue-400" />, color: 'border-blue-500/30 bg-blue-500/5' },
    { id: 'done', title: 'Done', icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />, color: 'border-emerald-500/30 bg-emerald-500/5' }
];

export function TodosView({ initialTodos }: { initialTodos: Todo[] }) {
    const searchParams = useSearchParams()
    const [todos, setTodos] = useState<Todo[]>(initialTodos)
    const [isPending, startTransition] = useTransition()
    const [newTodoTitle, setNewTodoTitle] = useState('')
    const [draggedTodoId, setDraggedTodoId] = useState<string | null>(null)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editTitle, setEditTitle] = useState('')

    // Auto-edit todo if requested via deep link
    useEffect(() => {
        const todoId = searchParams.get('todoId')
        if (todoId) {
            const todoToEdit = todos.find(t => t.id === todoId)
            if (todoToEdit && editingId !== todoId) {
                setEditingId(todoId)
                setEditTitle(todoToEdit.title)

                // Optionally scroll to it cleanly
                setTimeout(() => {
                    const el = document.getElementById(`todo-${todoId}`)
                    if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
                    }
                }, 100)
            }
        }
    }, [searchParams, todos, editingId])

    const handleCreateTodo = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newTodoTitle.trim()) return

        startTransition(async () => {
            try {
                const newTodo = await createTodo(newTodoTitle)
                setTodos(prev => [newTodo, ...prev])
                setNewTodoTitle('')
            } catch (error: any) {
                toast.error(error.message || 'Failed to create task')
            }
        })
    }

    const handleStatusChange = (id: string, newStatus: Status) => {
        const todo = todos.find(t => t.id === id)
        if (!todo || todo.status === newStatus) return

        // Optimistic update
        setTodos(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t))

        startTransition(async () => {
            try {
                await updateTodoStatus(id, newStatus)
            } catch (error: any) {
                toast.error(error.message || 'Failed to update task status')
                // Revert optimistic update
                setTodos(prev => prev.map(t => t.id === id ? { ...t, status: todo.status } : t))
            }
        })
    }

    const handleDelete = (id: string) => {
        startTransition(async () => {
            try {
                await deleteTodo(id)
                setTodos(prev => prev.filter(t => t.id !== id))
            } catch (error: any) {
                toast.error(error.message || 'Failed to delete task')
            }
        })
    }

    const handleSaveEdit = (id: string) => {
        if (!editTitle.trim()) {
            setEditingId(null)
            return
        }

        const todo = todos.find(t => t.id === id)
        if (!todo || todo.title === editTitle) {
            setEditingId(null)
            return
        }

        const oldTitle = todo.title

        // Optimistic update
        setTodos(prev => prev.map(t => t.id === id ? { ...t, title: editTitle } : t))
        setEditingId(null)

        startTransition(async () => {
            try {
                await updateTodoTitle(id, editTitle)
                toast.success('Task updated')
            } catch (error: any) {
                toast.error(error.message || 'Failed to update task')
                // Revert optimistic update
                setTodos(prev => prev.map(t => t.id === id ? { ...t, title: oldTitle } : t))
            }
        })
    }

    // Drag and Drop Handlers
    const handleDragStart = (e: React.DragEvent, id: string) => {
        setDraggedTodoId(id)
        e.dataTransfer.effectAllowed = 'move'
        // Slight delay to allow UI to render the dragging ghost before making original semitransparent
        setTimeout(() => {
            const el = document.getElementById(`todo-${id}`)
            if (el) el.style.opacity = '0.5'
        }, 0)
    }

    const handleDragEnd = (e: React.DragEvent, id: string) => {
        setDraggedTodoId(null)
        const el = document.getElementById(`todo-${id}`)
        if (el) el.style.opacity = '1'
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault() // Required to allow dropping
        e.dataTransfer.dropEffect = 'move'
    }

    const handleDrop = (e: React.DragEvent, status: Status) => {
        e.preventDefault()
        if (draggedTodoId) {
            handleStatusChange(draggedTodoId, status)
        }
    }

    return (
        <div className="space-y-6">
            {/* Add Task Bar */}
            <form onSubmit={handleCreateTodo} className="flex gap-2">
                <input
                    type="text"
                    value={newTodoTitle}
                    onChange={(e) => setNewTodoTitle(e.target.value)}
                    placeholder="Add a new task to your list..."
                    disabled={isPending}
                    className="flex-1 h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <button
                    type="submit"
                    disabled={isPending || !newTodoTitle.trim()}
                    className="h-10 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-50 flex items-center gap-2 transition-opacity"
                >
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    Add Task
                </button>
            </form>

            {/* Kanban Board */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                {COLUMNS.map(col => {
                    const columnTodos = todos.filter(t => t.status === col.id)

                    return (
                        <div
                            key={col.id}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, col.id)}
                            className={`flex flex-col gap-3 p-4 rounded-xl border ${col.color} min-h-[500px] transition-colors`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold flex items-center gap-2">
                                    {col.icon}
                                    {col.title}
                                </h3>
                                <span className="bg-background border border-border text-xs px-2 py-0.5 rounded-full font-medium">
                                    {columnTodos.length}
                                </span>
                            </div>

                            <div className="flex flex-col gap-3">
                                {columnTodos.map(todo => (
                                    <div
                                        key={todo.id}
                                        id={`todo-${todo.id}`}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, todo.id)}
                                        onDragEnd={(e) => handleDragEnd(e, todo.id)}
                                        className="bg-card text-card-foreground border border-border p-3 rounded-lg shadow-sm cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors group relative"
                                    >
                                        <div className="flex items-start gap-2">
                                            <GripVertical className="w-4 h-4 text-muted-foreground/50 shrink-0 mt-0.5" />
                                            {editingId === todo.id ? (
                                                <div className="flex-1 flex flex-col gap-2">
                                                    <textarea
                                                        value={editTitle}
                                                        onChange={(e) => setEditTitle(e.target.value)}
                                                        className="w-full text-sm leading-snug break-words p-1 border border-primary/50 rounded bg-background resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                                                        rows={2}
                                                        autoFocus
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                                e.preventDefault();
                                                                handleSaveEdit(todo.id);
                                                            } else if (e.key === 'Escape') {
                                                                setEditingId(null);
                                                            }
                                                        }}
                                                    />
                                                    <div className="flex justify-end gap-1">
                                                        <button
                                                            onClick={() => setEditingId(null)}
                                                            className="p-1 text-muted-foreground hover:bg-muted rounded"
                                                        >
                                                            <X className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleSaveEdit(todo.id)}
                                                            className="p-1 text-primary hover:bg-primary/10 rounded"
                                                        >
                                                            <Check className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p
                                                    className="text-sm leading-snug break-words flex-1 cursor-text"
                                                    onDoubleClick={() => {
                                                        setEditingId(todo.id)
                                                        setEditTitle(todo.title)
                                                    }}
                                                >
                                                    {todo.title}
                                                </p>
                                            )}
                                        </div>

                                        {/* Hover Actions (Desktop) / Mobile Actions */}
                                        <div className="mt-3 flex items-center justify-between pt-2 border-t border-border/50">
                                            {/* Mobile Status Select fallback */}
                                            <select
                                                className="text-[10px] bg-background border border-border rounded px-1 py-0.5 md:hidden"
                                                value={todo.status}
                                                onChange={(e) => handleStatusChange(todo.id, e.target.value as Status)}
                                            >
                                                <option value="todo">To Do</option>
                                                <option value="in_progress">In Progress</option>
                                                <option value="done">Done</option>
                                            </select>

                                            <div className="flex items-center gap-1 ml-auto">
                                                <button
                                                    onClick={() => {
                                                        setEditingId(todo.id)
                                                        setEditTitle(todo.title)
                                                    }}
                                                    className="p-1 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded transition-colors"
                                                    title="Edit Task"
                                                >
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(todo.id)}
                                                    className="p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
                                                    title="Delete Task"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {columnTodos.length === 0 && (
                                    <div className="border-2 border-dashed border-border/50 rounded-lg h-24 flex items-center justify-center text-muted-foreground text-sm opacity-50">
                                        Drop here
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
