export interface CustomEvent {
  id: number | null;
  title: string | null;
  with: string | null;
  time: {
    start: string | null;
    end: string | null;
  };
  colorScheme: string | [];
  isEditable: boolean;
  isCustom: boolean;
  description: string | null;
}
