declare global {
    interface Liveblocks {
      // Each user's Presence, for room.getPresence, room.subscribe("others"), etc.
      Presence: { 
        cursor: { x: number; y: number } | null; 
      };
      
      UserMeta: {
        id: string; // Accessible through `user.id`
        info: {
          name: string;
          color: string;
          picture: string;
        }; // Accessible through `user.info`
      };
    }
  }
  
  export {};