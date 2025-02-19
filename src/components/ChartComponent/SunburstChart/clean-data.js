export function cleanData(rawData) {
  return rawData
    .filter((b) => b.id !== 1)
    .map((board) => {
      const { id, name, project_value, closed, cards } = board;
      return {
        id,
        name,
        project_value,
        closed,
        cards: cards.map((card) => {
          const {
            id,
            title,
            start_date,
            end_date,
            actual_completion_date,
            task_type_details: {
              id: task_type_details_id,
              color: task_type_details_color,
              custom_label,
              normalised_label,
            },
          } = card;

          return {
            id,
            title,
            start_date,
            end_date,
            actual_completion_date,
            task_type_details: {
              id: task_type_details_id,
              color: task_type_details_color,
              custom_label,
              normalised_label,
            },
          };
        }),
      };
    });
}
