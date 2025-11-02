interface search_professor_response_item {
  name: string;
  id: number;
  classes: {
    year: number,
    class: string
  }[]
}

interface search_professors_response extends common_response {
  data: search_professor_response_item[]
}
