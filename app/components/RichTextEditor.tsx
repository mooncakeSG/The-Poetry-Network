import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { 
  Bold, Italic, Code, List, ListOrdered, Quote, Eye, Edit2,
  AlignLeft, AlignCenter, AlignRight, Type, Layout, BookOpen,
  BarChart2
} from 'lucide-react'
import { Toggle } from '@/components/ui/toggle'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useState } from 'react'
import { PoetryAnalysis } from './PoetryAnalysis'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  mode?: 'poem' | 'prose'
}

const POETRY_TEMPLATES = {
  sonnet: `Shall I compare thee to a summer's day?\nThou art more lovely and more temperate:\n...\n`,
  haiku: `An old silent pond...\nA frog jumps into the pond,\nsplash! Silence again.\n`,
  limerick: `There once was a...\nAnd...\n`,
  freeVerse: `Write your free verse poem here...\n`,
}

export function RichTextEditor({ 
  content, 
  onChange, 
  placeholder,
  mode = 'poem' 
}: RichTextEditorProps) {
  const [isPreview, setIsPreview] = useState(false)
  const [showLineNumbers, setShowLineNumbers] = useState(mode === 'poem')
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>('left')
  const [showAnalysis, setShowAnalysis] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: `prose dark:prose-invert max-w-none focus:outline-none min-h-[100px] ${
          showLineNumbers ? 'pl-8 relative poetry-line-numbers' : ''
        }`,
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editable: !isPreview,
  })

  if (!editor) {
    return null
  }

  const applyTemplate = (template: keyof typeof POETRY_TEMPLATES) => {
    editor.commands.setContent(POETRY_TEMPLATES[template])
    editor.commands.focus()
  }

  const applyAlignment = (align: 'left' | 'center' | 'right') => {
    setAlignment(align)
    editor.chain().focus().run()
    // Apply alignment class to editor content
    const element = editor.view.dom as HTMLElement
    element.style.textAlign = align
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <div className="flex items-center justify-between border-b bg-muted/50 p-1">
          <div className="flex flex-wrap gap-1">
            {!isPreview && (
              <>
                <Toggle
                  size="sm"
                  pressed={editor.isActive('bold')}
                  onPressedChange={() => editor.chain().focus().toggleBold().run()}
                >
                  <Bold className="h-4 w-4" />
                </Toggle>
                <Toggle
                  size="sm"
                  pressed={editor.isActive('italic')}
                  onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                >
                  <Italic className="h-4 w-4" />
                </Toggle>
                <Toggle
                  size="sm"
                  pressed={editor.isActive('code')}
                  onPressedChange={() => editor.chain().focus().toggleCode().run()}
                >
                  <Code className="h-4 w-4" />
                </Toggle>
                <Toggle
                  size="sm"
                  pressed={editor.isActive('bulletList')}
                  onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                >
                  <List className="h-4 w-4" />
                </Toggle>
                <Toggle
                  size="sm"
                  pressed={editor.isActive('orderedList')}
                  onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                >
                  <ListOrdered className="h-4 w-4" />
                </Toggle>
                <Toggle
                  size="sm"
                  pressed={editor.isActive('blockquote')}
                  onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
                >
                  <Quote className="h-4 w-4" />
                </Toggle>

                {/* Alignment Controls */}
                <Toggle
                  size="sm"
                  pressed={alignment === 'left'}
                  onPressedChange={() => applyAlignment('left')}
                >
                  <AlignLeft className="h-4 w-4" />
                </Toggle>
                <Toggle
                  size="sm"
                  pressed={alignment === 'center'}
                  onPressedChange={() => applyAlignment('center')}
                >
                  <AlignCenter className="h-4 w-4" />
                </Toggle>
                <Toggle
                  size="sm"
                  pressed={alignment === 'right'}
                  onPressedChange={() => applyAlignment('right')}
                >
                  <AlignRight className="h-4 w-4" />
                </Toggle>

                {/* Poetry Features */}
                {mode === 'poem' && (
                  <>
                    <Toggle
                      size="sm"
                      pressed={showLineNumbers}
                      onPressedChange={() => setShowLineNumbers(!showLineNumbers)}
                    >
                      <Layout className="h-4 w-4" />
                    </Toggle>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          <Type className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => applyTemplate('sonnet')}>
                          Sonnet Template
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => applyTemplate('haiku')}>
                          Haiku Template
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => applyTemplate('limerick')}>
                          Limerick Template
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => applyTemplate('freeVerse')}>
                          Free Verse
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                )}
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            {mode === 'poem' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAnalysis(!showAnalysis)}
              >
                <BarChart2 className="mr-2 h-4 w-4" />
                {showAnalysis ? 'Hide Analysis' : 'Show Analysis'}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPreview(!isPreview)}
            >
              {isPreview ? (
                <>
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </>
              )}
            </Button>
          </div>
        </div>
        <div 
          className={`p-3 ${isPreview ? 'cursor-default' : 'cursor-text'}`}
          style={{ textAlign: alignment }}
        >
          <EditorContent editor={editor} />
        </div>
      </div>

      {showAnalysis && mode === 'poem' && (
        <PoetryAnalysis content={editor.getText()} />
      )}
    </div>
  )
} 