jQuery ->
  $('#studies').dataTable(
    stteSave: true,
    sPaginationType: "full_numbers",
    pageLength: 50,
    lengthMenu: [25, 50, 75, 100, 1000],
    oLanguage: {"sSearch": "Filter: "}
  )
