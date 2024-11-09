export interface CollaborativeEditorProps {
  onChange: (content: string) => void;
  initialContent?: string;
  roomId: string;
}
