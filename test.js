const fs = require("fs");
const test = require("ava");
const parse = require("./parse");

test("testing multifarious on mozilla example", (t) => {
  const body = `POST /test HTTP/1.1 
Host: foo.example
Content-Type: multipart/form-data;boundary="boundary" 

--boundary 
Content-Disposition: form-data; name="field1" 

value1 
--boundary 
Content-Disposition: form-data; name="field2"; filename="example.txt" 

value2
--boundary--`;
  const results = parse({ body, debug: false });
  t.deepEqual(results, [
    { name: "field1", content: "value1" },
    { name: "field2", filename: "example.txt", content: "value2" },
  ]);
});

test("testing lambda", (t) => {
  const body = fs.readFileSync("./test_data/test.txt", "utf-8");
  const results = parse({ body, debug: false });
  t.deepEqual(results, [
    {
      name: "test.jpg",
      content:
        "data:image/jpeg;base64,/9j/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQECAQEBAQEBAgICAgICAgICAgICAgIDAwMDAwMDAwMDAwMDAwP/2wBDAQEBAQEBAQIBAQIDAgICAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwP/wgARCAAEAAUDAREAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABUBAQEAAAAAAAAAAAAAAAAAAAYH/9oADAMBAAIQAxAAAAE4J8m//8QAFhABAQEAAAAAAAAAAAAAAAAABAMF/9oACAEBAAEFAivNXO//xAAdEQABBAIDAAAAAAAAAAAAAAABAgMEBQARUWFi/9oACAEDAQE/AYdDWPRw46gqJ9HrjWf/xAAdEQACAgEFAAAAAAAAAAAAAAABAgMEBQAGEUFC/9oACAECAQE/AcjuXL17rQQuAqgeR3zr/8QAHhAAAQMEAwAAAAAAAAAAAAAAAwECEQQFEiEAInH/2gAIAQEABj8CpSFslnKXMyKV4q3NzUYNWNWDx1nWvZ5//8QAGBABAQADAAAAAAAAAAAAAAAAAREAIUH/2gAIAQEAAT8hbXJ4F0U0EFe1vP/aAAwDAQACAAMAAAAQv//EABgRAQEBAQEAAAAAAAAAAAAAAAERITFB/9oACAEDAQE/EFNE6jgAIh5eVVryf//EABoRAQACAwEAAAAAAAAAAAAAAAERIQAxQWH/2gAIAQIBAT8Qcq2EtqbKLwrXmf/EABYQAQEBAAAAAAAAAAAAAAAAAAEAEf/aAAgBAQABPxBaT3gEnwOSdn//2Q==",
    },
  ]);
});
