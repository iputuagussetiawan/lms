"use client"
import { AdminCourseSingularType } from '@/app/data/admin/admin-get-course';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { DndContext, DraggableSyntheticListeners, KeyboardSensor, PointerSensor, rectIntersection, useSensor, useSensors } from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronDown, ChevronRight, FileText, GripVertical, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { listeners, title } from 'process';
import React, { ReactNode, useState } from 'react'
import { Chevron } from 'react-day-picker';

interface CourseStructureProps {
    data:AdminCourseSingularType;
}

interface SortableItemProps {
    id: string;
    children:(listeners:DraggableSyntheticListeners)=>ReactNode;
    className?:string;
    data?:{
        type:"chapter"|"lesson";
        chapterId?:string;
    }
}

const CourseStructure = ({data}:CourseStructureProps) => {

    const initialItems=data.chapter.map((chapter)=>({
        id:chapter.id,
        title:chapter.title,
        order:chapter.position,
        isOpen:true, // default chapter is open
        lessons:chapter.lessons.map((lesson)=>({
            id:lesson.id,
            title:lesson.title,
            order:lesson.position
        }))
    }))|| [];
    const [items, setItems] = useState(initialItems);

    function SortableItem({children, id,className, data }:SortableItemProps) {
        const {
            attributes,
            listeners,
            setNodeRef,
            transform,
            transition,
            isDragging
        } = useSortable({id: id, data: data});
        
        const style = {
            transform: CSS.Transform.toString(transform),
            transition,
        };
        
        return (
            <div 
                ref={setNodeRef} 
                style={style} {...attributes}  
                className={cn("touch-none", className, isDragging ? "z-10":"")}
            >
                {children(listeners)}
            </div>
        );
    }
    function handleDragEnd(event) {
        const {active, over} = event;
        
        if (active.id !== over.id) {
        setItems((items) => {
            const oldIndex = items.indexOf(active.id);
            const newIndex = items.indexOf(over.id);
            
            return arrayMove(items, oldIndex, newIndex);
        });
        }
    }

    function toggleChapter(chapterId:string) {
        setItems(
            items.map((chapter)=>
                chapter.id===chapterId
                    ?{...chapter,isOpen:!chapter.isOpen}
                    :chapter
                )
            );
    }

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
        })
    );
    return (
        <DndContext 
            collisionDetection={rectIntersection}
            onDragEnd={handleDragEnd}
            sensors={sensors}
        >
            <Card>
                <CardHeader className="flex flex-row items-center justify-between border-b border-border">
                    <CardTitle>Chapters</CardTitle>
                </CardHeader>
                <CardContent>
                    <SortableContext items={items} strategy={verticalListSortingStrategy}>
                        {items.map((item) => (
                            <SortableItem
                                key={item.id}
                                id={item.id}
                                data={{ type: "chapter" }}
                            >
                                {(listeners) => (
                                    <Card>
                                        <Collapsible
                                            open={item.isOpen}
                                            onOpenChange={() => toggleChapter(item.id)}
                                        >
                                            <div className="flex items-center justify-between p-3 border border-border">
                                                <div className="flex items-center gap-2">
                                                    <Button variant={"ghost"} size={"icon"} className="cursor-grab opacity-60 hover:opacity-100" {...listeners}>
                                                        <GripVertical className="h-4 w-4"/>
                                                    </Button>
                                                    <CollapsibleTrigger asChild>
                                                        <Button size={"icon"} variant={"ghost"} className='flex items-center'>
                                                            {item.isOpen?(
                                                                <ChevronDown className="h-4 w-4"/>
                                                            ):(
                                                                <ChevronRight className="h-4 w-4"/>
                                                            )}
                                                        </Button>
                                                    </CollapsibleTrigger>
                                                    <p className='cursor-pointer hover:text-primary pl-2'>{item.title}</p>
                                                </div>
                                                <Button size={"icon"} variant={"ghost"}>
                                                    <Trash2 className="h-4 w-4"/>
                                                </Button>
                                            </div>
                                            <CollapsibleContent>
                                                <div className='p-1'>
                                                    <SortableContext 
                                                        items={item.lessons.map((lesson)=>lesson.id)}
                                                        strategy={verticalListSortingStrategy}
                                                    >
                                                        {item.lessons.map((lesson)=>(
                                                            <SortableItem
                                                                key={lesson.id}
                                                                id={lesson.id}
                                                                data={{ type: "lesson", chapterId: item.id }}
                                                            >
                                                                {(lessonListeners) => (
                                                                    <div className='flex items-center justify-between p-2 hover:bg-accent rounded-sm'>
                                                                        <div className='flex items-center gap-2'>
                                                                            <Button 
                                                                                variant={"ghost"} 
                                                                                size={"icon"}
                                                                                {...lessonListeners}
                                                                            >
                                                                                <GripVertical className="h-4 w-4"/>
                                                                            </Button>
                                                                            <FileText className="h-4 w-4"/>
                                                                            <Link href={`/admin/courses/${data.id}/${item.id}/${lesson.id}`}>{lesson.title}</Link>
                                                                        </div>
                                                                        <Button variant={"ghost"} size={"icon"}>
                                                                            <Trash2 className="h-4 w-4"/>
                                                                        </Button>
                                                                    </div>
                                                                )}
                                                            </SortableItem>
                                                        ))}
                                                    </SortableContext>
                                                    <div className='p-2'>
                                                        <Button className='w-full' variant={"outline"}>
                                                            Create New Lesson
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CollapsibleContent>
                                        </Collapsible>
                                    </Card>
                                )}
                            </SortableItem>
                        ))}
                    </SortableContext>
                </CardContent>
            </Card>
        </DndContext>
    )
}

export default CourseStructure