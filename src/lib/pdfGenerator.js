import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

class PDFGenerator {
  model = null;
  schema = null;
  docDefinition = null;

  constructor(model, schema) {
    this.model = model;
    this.schema = schema;
    this.docDefinition = {
      info: {
        title: "Übermittlungsbericht",
        author: "Formularium",
        json: model,
        schema: schema
      },

      content: [
        { text: "Übermittlungsbericht", style: "header", margin: [0, 5] },
        {
          text:
            "Dieses Dokument ist in seiner digitalen Form ein qualifizierter Sendebericht."
        },
        { text: "Folgende Informationen wurden erfolgreich übermittelt:" }
      ],
      styles: {
        header: {
          fontSize: 22,
          bold: true
        },

        sectionTitle: {
          fontSize: 18,
          bold: true
        },

        fieldName: {
          fontSize: 13,
          bold: true
        },

        fieldContent: {
          fontSize: 13,
          bold: false
        }
      }
    };
  }

  download() {
    pdfMake.createPdf(this.docDefinition).download();
  }

  generate() {
    for (var e in this.schema) {
      console.log(this.schema[e]);
      if (this.schema[e].type === "form") {
        this.parseFormSection(this.schema[e].schema);
      } else if (this.schema[e].type === "navigation") {
        this.parseNavigation(this.schema[e].schema);
      }
    }
  }

  parseFormSection(section) {
    for (var e in section.properties) {
      var submodel = this.model[e];
      this.docDefinition.content.push({
        text: section.properties[e].title,
        style: "sectionTitle",
        margin: [0, 10, 0, 5]
      });
      for (var field in section.properties[e].properties) {
        this.parseFormField(
          section.properties[e].properties[field],
          submodel[field]
        );
      }
    }
  }

  parseFormField(field, model) {
    var value;
    if (model instanceof Array) {
      value = model.join(", ");
    } else if (field.oneOf) {
      value = field.oneOf.filter(obj => {
        return obj.const == model;
      })[0]["title"];
    } else {
      value = model;
    }

    this.docDefinition.content.push({
      columns: [
        {
          width: "30%",
          text: field.title,
          style: "fieldName"
        },
        {
          width: "70%",
          text: value,
          style: "fieldContent"
        }
      ]
    });
  }

  parseNavigation(section) {
    this.docDefinition.content.push({
      text: section.title,
      style: "sectionTitle",
      margin: [0, 10, 0, 5]
    });
    if (section.oneOf) {
      this.docDefinition.content.push({
        columns: [
          {
            width: "30%",
            text: "Auswahl",
            style: "fieldName"
          },
          {
            width: "70%",
            text: section.oneOf.filter(obj => {
              return obj.const == this.model[section.name];
            })[0]["title"],
            style: "fieldContent"
          }
        ]
      });
    }
  }

  addSignature(content, signature) {
    this.docDefinition.info["signedContent"] = content;
    this.docDefinition.info["signature"] = signature;
  }
}

export default PDFGenerator;
