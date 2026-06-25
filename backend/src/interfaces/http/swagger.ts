import swaggerUi from "swagger-ui-express";

export const swaggerSpec: swaggerUi.JsonObject = {
  openapi: "3.0.3",
  info: {
    title: "ADQPAL — API da Clínica",
    version: "1.0.0",
    description:
      "API completa do sistema de gestão clínica ADQPAL. Inclui módulos de agendamento, prontuário, financeiro, RH, notas fiscais, transcritor de áudio e integração bancária via Pluggy.",
    contact: {
      email: "suporte@adqpal.com",
    },
  },
  servers: [
    { url: "http://localhost:3333", description: "Desenvolvimento" },
    { url: "https://clinica-adqpal.vercel.app", description: "Produção (Vercel)" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Token JWT obtido via POST /users/login ou verify-2fa",
      },
      syncSecretAuth: {
        type: "http",
        scheme: "bearer",
        description: "Token interno definido em SYNC_SECRET",
      },
    },
    schemas: {
      // ─── Error ──────────────────────────────────────────────────────────
      ApiError: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string" },
          errors: {
            type: "object",
            additionalProperties: {
              type: "array",
              items: { type: "string" },
            },
          },
        },
      },

      // ─── User ──────────────────────────────────────────────────────────
      RegisterUserInput: {
        type: "object",
        required: ["username", "email", "password", "roleId"],
        properties: {
          username: { type: "string", minLength: 3, maxLength: 50, example: "maria.silva" },
          email: { type: "string", format: "email", example: "maria@adqpal.com" },
          password: { type: "string", format: "password", minLength: 8, description: "Deve conter 1 maiúscula e 1 número" },
          roleId: { type: "integer", description: "1=ADMIN, 2=RECEPCIONISTA, 3=MEDICO" },
          cpf: { type: "string", nullable: true, pattern: "^\\d{11}$", description: "11 dígitos" },
          cnpj: { type: "string", nullable: true, pattern: "^\\d{14}$", description: "14 dígitos" },
          specialtyIds: { type: "array", items: { type: "string", format: "uuid" } },
        },
      },
      LoginUserInput: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string", format: "password" },
        },
      },
      Verify2FAInput: {
        type: "object",
        required: ["code"],
        properties: {
          code: { type: "string", minLength: 6, maxLength: 6, description: "Código de 6 dígitos recebido por e-mail" },
        },
      },
      UpdateUserInput: {
        type: "object",
        properties: {
          username: { type: "string", minLength: 3, maxLength: 50 },
          email: { type: "string", format: "email" },
          currentPassword: { type: "string", description: "Obrigatório se password for informado" },
          password: { type: "string", minLength: 8, description: "Deve conter 1 maiúscula e 1 número" },
          roleId: { type: "integer" },
          cpf: { type: "string", nullable: true, pattern: "^\\d{11}$" },
          cnpj: { type: "string", nullable: true, pattern: "^\\d{14}$" },
          specialtyIds: { type: "array", items: { type: "string", format: "uuid" } },
        },
      },
      UserResponse: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          username: { type: "string" },
          email: { type: "string" },
          roleId: { type: "integer" },
          cpf: { type: "string", nullable: true },
          cnpj: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      LoginResponse: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          message: { type: "string" },
          data: {
            type: "object",
            properties: {
              requires2fa: { type: "boolean" },
              tempToken: { type: "string" },
              token: { type: "string" },
              user: { $ref: "#/components/schemas/UserResponse" },
            },
          },
        },
      },

      // ─── Patient ──────────────────────────────────────────────────────
      CreatePatientInput: {
        type: "object",
        required: ["name", "gender", "agreement"],
        properties: {
          name: { type: "string", minLength: 2, maxLength: 100, example: "João Pereira" },
          email: { type: "string", format: "email", nullable: true },
          phone: { type: "string", maxLength: 20, nullable: true, example: "(11) 99999-9999" },
          cpf: { type: "string", nullable: true, pattern: "^\\d{11}$" },
          dateOfBirth: { type: "string", format: "date", nullable: true, example: "1990-05-15" },
          gender: { type: "string", example: "Masculino" },
          agreement: { type: "string", example: "Unimed" },
          street: { type: "string", maxLength: 255, nullable: true },
          streetNumber: { type: "string", maxLength: 20, nullable: true },
          city: { type: "string", maxLength: 100, nullable: true },
          state: { type: "string", maxLength: 2, nullable: true, example: "SP" },
          zipCode: { type: "string", nullable: true, example: "01310-000" },
          additionalInfo: { type: "string", maxLength: 1000, nullable: true },
        },
      },
      UpdatePatientInput: {
        type: "object",
        properties: {
          name: { type: "string", minLength: 2, maxLength: 100 },
          email: { type: "string", format: "email", nullable: true },
          phone: { type: "string", maxLength: 20, nullable: true },
          cpf: { type: "string", nullable: true },
          dateOfBirth: { type: "string", format: "date", nullable: true },
          street: { type: "string", maxLength: 255, nullable: true },
          streetNumber: { type: "string", maxLength: 20, nullable: true },
          city: { type: "string", maxLength: 100, nullable: true },
          state: { type: "string", maxLength: 2, nullable: true },
          zipCode: { type: "string", nullable: true },
          additionalInfo: { type: "string", maxLength: 1000, nullable: true },
        },
      },
      PatientResponse: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
          email: { type: "string", nullable: true },
          phone: { type: "string", nullable: true },
          cpf: { type: "string", nullable: true },
          dateOfBirth: { type: "string", format: "date", nullable: true },
          gender: { type: "string", nullable: true },
          agreement: { type: "string", nullable: true },
          street: { type: "string", nullable: true },
          streetNumber: { type: "string", nullable: true },
          city: { type: "string", nullable: true },
          state: { type: "string", nullable: true },
          zipCode: { type: "string", nullable: true },
          additionalInfo: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },

      // ─── Appointment ─────────────────────────────────────────────────
      CreateAppointmentInput: {
        type: "object",
        required: ["userId", "patientId", "scheduledAt"],
        properties: {
          userId: { type: "string", format: "uuid", description: "Médico responsável" },
          patientId: { type: "string", format: "uuid" },
          scheduledAt: { type: "string", format: "date-time", example: "2026-06-15T14:30:00.000Z" },
          medico: { type: "string", maxLength: 200, nullable: true, description: "Nome do médico (override)" },
          type: { type: "string", enum: ["IN_PERSON", "ONLINE", "HOME_CARE"], default: "IN_PERSON" },
          specialtyId: { type: "string", format: "uuid", nullable: true },
          roomId: { type: "string", maxLength: 100, nullable: true, description: "Obrigatório para IN_PERSON" },
          meetingLink: { type: "string", maxLength: 500, nullable: true, description: "Obrigatório para ONLINE" },
          address: { type: "string", maxLength: 500, nullable: true, description: "Obrigatório para HOME_CARE" },
          notes: { type: "string", maxLength: 1000, nullable: true },
        },
      },
      UpdateAppointmentInput: {
        type: "object",
        properties: {
          userId: { type: "string", format: "uuid" },
          patientId: { type: "string", format: "uuid" },
          scheduledAt: { type: "string", format: "date-time" },
          medico: { type: "string", nullable: true },
          status: { type: "string", enum: ["SCHEDULED", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELED", "NO_SHOW", "CANCELLED"] },
          type: { type: "string", enum: ["IN_PERSON", "ONLINE", "HOME_CARE"] },
          specialtyId: { type: "string", format: "uuid", nullable: true },
          roomId: { type: "string", nullable: true },
          meetingLink: { type: "string", nullable: true },
          address: { type: "string", nullable: true },
          notes: { type: "string", maxLength: 1000, nullable: true },
        },
      },
      SendWhatsAppInput: {
        type: "object",
        required: ["telefone"],
        properties: {
          telefone: { type: "string", example: "+5511999999999", description: "Formato internacional" },
          channels: {
            type: "array",
            items: { type: "string", enum: ["whatsapp", "sms"] },
            default: ["whatsapp"],
          },
        },
      },
      AppointmentResponse: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          userId: { type: "string", format: "uuid" },
          patientId: { type: "string", format: "uuid" },
          scheduledAt: { type: "string", format: "date-time" },
          medico: { type: "string", nullable: true },
          status: { type: "string", enum: ["SCHEDULED", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELED", "NO_SHOW", "CANCELLED"] },
          type: { type: "string", enum: ["IN_PERSON", "ONLINE", "HOME_CARE"] },
          notes: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },

      // ─── Medical Record ──────────────────────────────────────────────
      CreateMedicalRecordInput: {
        type: "object",
        required: ["patientId"],
        properties: {
          appointmentId: { type: "string", format: "uuid", nullable: true },
          patientId: { type: "string", format: "uuid" },
          diagnosis: { type: "string", maxLength: 2000, nullable: true },
          prescription: { type: "string", maxLength: 2000, nullable: true },
          notes: { type: "string", maxLength: 2000, nullable: true },
        },
      },
      UpdateMedicalRecordInput: {
        type: "object",
        properties: {
          diagnosis: { type: "string", maxLength: 2000, nullable: true },
          prescription: { type: "string", maxLength: 2000, nullable: true },
          notes: { type: "string", maxLength: 2000, nullable: true },
        },
      },
      MedicalRecordResponse: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          appointmentId: { type: "string", format: "uuid", nullable: true },
          patientId: { type: "string", format: "uuid" },
          diagnosis: { type: "string", nullable: true },
          prescription: { type: "string", nullable: true },
          notes: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },

      // ─── Patient History ─────────────────────────────────────────────
      CreatePatientHistoryInput: {
        type: "object",
        required: ["type", "title", "description"],
        properties: {
          appointmentId: { type: "string", format: "uuid", nullable: true },
          type: { type: "string", enum: ["CONSULTA", "EXAME", "PRESCRICAO", "OBSERVACAO", "SOLICITACAO"] },
          title: { type: "string", minLength: 3, maxLength: 200 },
          description: { type: "string", minLength: 10 },
          attachments: { type: "array", items: { type: "string", format: "uri" } },
        },
      },
      PatientHistoryResponse: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          patientId: { type: "string", format: "uuid" },
          doctorId: { type: "string", format: "uuid" },
          appointmentId: { type: "string", format: "uuid", nullable: true },
          type: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
          attachments: { type: "array", items: { type: "string" } },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },

      // ─── Specialty ───────────────────────────────────────────────────
      SpecialtyResponse: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
        },
      },

      // ─── Financial Account ───────────────────────────────────────────
      CreateFinancialAccountInput: {
        type: "object",
        required: ["name", "type"],
        properties: {
          name: { type: "string", minLength: 2, maxLength: 100 },
          type: { type: "string", enum: ["CHECKING", "SAVINGS", "CASH", "CREDIT_CARD", "INVESTMENT"] },
          bank: { type: "string", maxLength: 100, nullable: true },
          initialBalance: { type: "number", default: 0 },
          currency: { type: "string", default: "BRL" },
          isDefault: { type: "boolean", default: false },
          color: { type: "string", nullable: true },
        },
      },
      UpdateFinancialAccountInput: {
        type: "object",
        properties: {
          name: { type: "string", minLength: 2, maxLength: 100 },
          type: { type: "string", enum: ["CHECKING", "SAVINGS", "CASH", "CREDIT_CARD", "INVESTMENT"] },
          bank: { type: "string", nullable: true },
          isActive: { type: "boolean" },
          isDefault: { type: "boolean" },
          color: { type: "string", nullable: true },
        },
      },
      FinancialAccountResponse: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
          type: { type: "string" },
          bank: { type: "string", nullable: true },
          initialBalance: { type: "number" },
          currentBalance: { type: "number" },
          currency: { type: "string" },
          isActive: { type: "boolean" },
          isDefault: { type: "boolean" },
          color: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },

      // ─── Financial Category ─────────────────────────────────────────
      CreateFinancialCategoryInput: {
        type: "object",
        required: ["name", "type"],
        properties: {
          name: { type: "string", minLength: 2, maxLength: 100 },
          type: { type: "string", enum: ["INCOME", "EXPENSE", "BOTH"] },
          color: { type: "string", nullable: true },
          icon: { type: "string", maxLength: 50, nullable: true },
          parentId: { type: "string", format: "uuid", nullable: true },
        },
      },
      UpdateFinancialCategoryInput: {
        type: "object",
        properties: {
          name: { type: "string", minLength: 2, maxLength: 100 },
          type: { type: "string", enum: ["INCOME", "EXPENSE", "BOTH"] },
          color: { type: "string", nullable: true },
          icon: { type: "string", nullable: true },
          parentId: { type: "string", format: "uuid", nullable: true },
          isActive: { type: "boolean" },
        },
      },
      FinancialCategoryResponse: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
          type: { type: "string" },
          color: { type: "string", nullable: true },
          icon: { type: "string", nullable: true },
          parentId: { type: "string", format: "uuid", nullable: true },
          isDefault: { type: "boolean" },
          isActive: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },

      // ─── Transaction ─────────────────────────────────────────────────
      CreateTransactionInput: {
        type: "object",
        required: ["accountId", "categoryId", "createdBy", "type", "amount", "description", "dueDate"],
        properties: {
          accountId: { type: "string", format: "uuid" },
          categoryId: { type: "string", format: "uuid" },
          createdBy: { type: "string", format: "uuid" },
          type: { type: "string", enum: ["INCOME", "EXPENSE", "TRANSFER"] },
          amount: { type: "number", exclusiveMinimum: 0 },
          description: { type: "string", minLength: 1, maxLength: 500 },
          status: { type: "string", enum: ["PENDING", "CONFIRMED", "CANCELLED"], default: "PENDING" },
          paymentMethod: { type: "string", enum: ["CASH", "CREDIT_CARD", "DEBIT_CARD", "PIX", "BANK_TRANSFER", "INSURANCE", "OTHER"], default: "OTHER" },
          dueDate: { type: "string", format: "date-time" },
          paidAt: { type: "string", format: "date-time", nullable: true },
          patientId: { type: "string", format: "uuid", nullable: true },
          appointmentId: { type: "string", format: "uuid", nullable: true },
          reference: { type: "string", maxLength: 200, nullable: true },
          isRecurring: { type: "boolean", default: false },
          installmentNumber: { type: "integer", nullable: true },
          totalInstallments: { type: "integer", nullable: true },
          transferToAccountId: { type: "string", format: "uuid", nullable: true },
          tags: { type: "array", items: { type: "string" } },
          attachmentUrl: { type: "string", format: "uri", nullable: true },
        },
      },
      UpdateTransactionInput: {
        type: "object",
        properties: {
          accountId: { type: "string", format: "uuid" },
          categoryId: { type: "string", format: "uuid" },
          type: { type: "string", enum: ["INCOME", "EXPENSE", "TRANSFER"] },
          amount: { type: "number", exclusiveMinimum: 0 },
          description: { type: "string", maxLength: 500 },
          status: { type: "string", enum: ["PENDING", "CONFIRMED", "CANCELLED"] },
          paymentMethod: { type: "string", enum: ["CASH", "CREDIT_CARD", "DEBIT_CARD", "PIX", "BANK_TRANSFER", "INSURANCE", "OTHER"] },
          dueDate: { type: "string", format: "date-time" },
          paidAt: { type: "string", format: "date-time", nullable: true },
          reference: { type: "string", nullable: true },
          tags: { type: "array", items: { type: "string" } },
          attachmentUrl: { type: "string", format: "uri", nullable: true },
        },
      },
      TransactionResponse: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          accountId: { type: "string", format: "uuid" },
          categoryId: { type: "string", format: "uuid" },
          type: { type: "string" },
          amount: { type: "number" },
          description: { type: "string" },
          status: { type: "string" },
          paymentMethod: { type: "string" },
          dueDate: { type: "string", format: "date-time" },
          paidAt: { type: "string", format: "date-time", nullable: true },
          tags: { type: "array", items: { type: "string" } },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },

      // ─── Dashboard ───────────────────────────────────────────────────
      DashboardResponse: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          data: {
            type: "array",
            items: {
              type: "object",
              properties: {
                month: { type: "string", example: "2026-01" },
                label: { type: "string", example: "Jan" },
                income: { type: "number" },
                expense: { type: "number" },
              },
            },
          },
        },
      },

      // ─── Employee ────────────────────────────────────────────────────
      CreateEmployeeInput: {
        type: "object",
        required: ["name", "position"],
        properties: {
          name: { type: "string", minLength: 2, maxLength: 100 },
          cpf: { type: "string", nullable: true, pattern: "^\\d{11}$" },
          email: { type: "string", format: "email", nullable: true },
          phone: { type: "string", nullable: true },
          position: { type: "string", minLength: 2, maxLength: 100 },
          department: { type: "string", nullable: true },
          hireDate: { type: "string", format: "date", nullable: true },
          salary: { type: "number", nullable: true },
          status: { type: "string", enum: ["ACTIVE", "INACTIVE", "ON_LEAVE", "TERMINATED"], default: "ACTIVE" },
          dateOfBirth: { type: "string", format: "date", nullable: true },
          gender: { type: "string", nullable: true },
          street: { type: "string", nullable: true },
          streetNumber: { type: "string", nullable: true },
          city: { type: "string", nullable: true },
          state: { type: "string", maxLength: 2, nullable: true },
          zipCode: { type: "string", nullable: true },
          notes: { type: "string", maxLength: 2000, nullable: true },
        },
      },
      UpdateEmployeeInput: {
        type: "object",
        properties: {
          name: { type: "string", minLength: 2, maxLength: 100 },
          cpf: { type: "string", nullable: true },
          email: { type: "string", format: "email", nullable: true },
          phone: { type: "string", nullable: true },
          position: { type: "string", minLength: 2, maxLength: 100 },
          department: { type: "string", nullable: true },
          hireDate: { type: "string", format: "date", nullable: true },
          salary: { type: "number", nullable: true },
          status: { type: "string", enum: ["ACTIVE", "INACTIVE", "ON_LEAVE", "TERMINATED"] },
          dateOfBirth: { type: "string", format: "date", nullable: true },
          gender: { type: "string", nullable: true },
          street: { type: "string", nullable: true },
          streetNumber: { type: "string", nullable: true },
          city: { type: "string", nullable: true },
          state: { type: "string", maxLength: 2, nullable: true },
          zipCode: { type: "string", nullable: true },
          notes: { type: "string", maxLength: 2000, nullable: true },
        },
      },
      EmployeeResponse: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
          cpf: { type: "string", nullable: true },
          email: { type: "string", nullable: true },
          phone: { type: "string", nullable: true },
          position: { type: "string" },
          department: { type: "string", nullable: true },
          hireDate: { type: "string", nullable: true },
          salary: { type: "number", nullable: true },
          status: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },

      // ─── Nota Fiscal ─────────────────────────────────────────────────
      CreateNotaFiscalInput: {
        type: "object",
        required: ["patientId", "servico", "valor"],
        properties: {
          patientId: { type: "string", format: "uuid" },
          appointmentId: { type: "string", format: "uuid", nullable: true },
          transactionId: { type: "string", format: "uuid", nullable: true },
          servico: { type: "string", minLength: 2, maxLength: 255 },
          valor: { type: "number", exclusiveMinimum: 0 },
          observacoes: { type: "string", maxLength: 2000, nullable: true },
        },
      },
      UpdateNotaFiscalInput: {
        type: "object",
        properties: {
          servico: { type: "string", minLength: 2, maxLength: 255 },
          valor: { type: "number", exclusiveMinimum: 0 },
          observacoes: { type: "string", nullable: true },
          pdfUrl: { type: "string", format: "uri", nullable: true },
        },
      },
      NotaFiscalResponse: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          numero: { type: "string" },
          patientId: { type: "string", format: "uuid" },
          servico: { type: "string" },
          valor: { type: "number" },
          status: { type: "string", enum: ["PENDENTE", "PROCESSANDO", "ERRO", "EMITIDA", "CANCELADA"] },
          dataEmissao: { type: "string", nullable: true },
          pdfUrl: { type: "string", nullable: true },
          observacoes: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },

      // ─── Password ────────────────────────────────────────────────────
      ForgotPasswordInput: {
        type: "object",
        required: ["email"],
        properties: {
          email: { type: "string", format: "email" },
        },
      },
      ResetPasswordInput: {
        type: "object",
        required: ["token", "password"],
        properties: {
          token: { type: "string" },
          password: { type: "string", format: "password", minLength: 8, description: "Deve conter 1 maiúscula e 1 número" },
        },
      },

      // ─── SUS Procedure ───────────────────────────────────────────────
      SusProcedureResponse: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          codigo: { type: "string" },
          nome: { type: "string" },
          modalidade: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
    },
  },
  paths: {
    // ═══════════════════════════════════════════════════════════════════════
    //  HEALTH
    // ═══════════════════════════════════════════════════════════════════════
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "ok" },
                    timestamp: { type: "string", format: "date-time" },
                  },
                },
              },
            },
          },
        },
      },
    },

    "/internal/keepalive": {
      get: {
        tags: ["Internal"],
        summary: "Keep-alive interno do banco de dados",
        description: "Executa uma consulta simples (`SELECT 1`) para manter a conexão com o banco ativa. Quando `SYNC_SECRET` estiver configurado, exige `Authorization: Bearer <SYNC_SECRET>`.",
        security: [{ syncSecretAuth: [] }],
        responses: {
          "200": {
            description: "Banco acessível.",
            content: {
              "text/plain": {
                schema: { type: "string", example: "ok" },
              },
            },
          },
          "401": {
            description: "Token interno ausente ou inválido.",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } },
          },
          "500": {
            description: "Falha ao executar a consulta no banco.",
            content: {
              "text/plain": {
                schema: { type: "string", example: "error" },
              },
            },
          },
        },
      },
    },

    // ═══════════════════════════════════════════════════════════════════════
    //  USERS
    // ═══════════════════════════════════════════════════════════════════════
    "/users/register": {
      post: {
        tags: ["Usuários"],
        summary: "Registrar novo usuário",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/RegisterUserInput" } } },
        },
        responses: {
          "201": { description: "Usuário criado com sucesso." },
          "400": { description: "Dados inválidos.", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } } },
          "409": { description: "E-mail, username, CPF ou CNPJ já cadastrado." },
        },
      },
    },
    "/users/login": {
      post: {
        tags: ["Usuários"],
        summary: "Autenticar usuário (com 2FA)",
        description: "Se dispositivo confiável (cookie), retorna token direto. Caso contrário, envia código por e-mail e retorna tempToken.",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/LoginUserInput" } } },
        },
        responses: {
          "200": { description: "Login realizado.", content: { "application/json": { schema: { $ref: "#/components/schemas/LoginResponse" } } } },
          "401": { description: "Credenciais inválidas." },
        },
      },
    },
    "/users/verify-2fa": {
      post: {
        tags: ["Usuários"],
        summary: "Verificar código 2FA",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/Verify2FAInput" } } },
        },
        responses: {
          "200": { description: "2FA verificado com sucesso. Retorna token JWT." },
          "401": { description: "Código inválido ou expirado." },
        },
      },
    },
    "/users/verify-2fa/resend": {
      post: {
        tags: ["Usuários"],
        summary: "Reenviar código 2FA",
        responses: {
          "200": { description: "Código reenviado." },
        },
      },
    },
    "/users/logout": {
      post: {
        tags: ["Usuários"],
        summary: "Logout (revoga token)",
        responses: {
          "200": { description: "Logout realizado." },
        },
      },
    },
    "/users/check-admin": {
      get: {
        tags: ["Usuários"],
        summary: "Verificar se usuário logado é admin",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Resultado da verificação",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "object",
                      properties: { isAdmin: { type: "boolean" } },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/users": {
      get: {
        tags: ["Usuários"],
        summary: "Listar todos os usuários (ADMIN)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "search", in: "query", schema: { type: "string" }, description: "Busca por username/e-mail" },
          { name: "roleId", in: "query", schema: { type: "integer" }, description: "Filtrar por role" },
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
        ],
        responses: {
          "200": {
            description: "Lista de usuários",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: { type: "array", items: { $ref: "#/components/schemas/UserResponse" } },
                    pagination: {
                      type: "object",
                      properties: {
                        total: { type: "integer" },
                        page: { type: "integer" },
                        limit: { type: "integer" },
                        totalPages: { type: "integer" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/users/{id}": {
      get: {
        tags: ["Usuários"],
        summary: "Buscar usuário por ID",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "200": { description: "Usuário encontrado." }, "404": { description: "Usuário não encontrado." } },
      },
      put: {
        tags: ["Usuários"],
        summary: "Atualizar usuário",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateUserInput" } } } },
        responses: { "200": { description: "Usuário atualizado." } },
      },
      delete: {
        tags: ["Usuários"],
        summary: "Deletar usuário (ADMIN)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "200": { description: "Usuário deletado." } },
      },
    },

    // ═══════════════════════════════════════════════════════════════════════
    //  PATIENTS
    // ═══════════════════════════════════════════════════════════════════════
    "/patients": {
      post: {
        tags: ["Pacientes"],
        summary: "Criar paciente",
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CreatePatientInput" } } } },
        responses: { "201": { description: "Paciente criado." } },
      },
      get: {
        tags: ["Pacientes"],
        summary: "Listar pacientes",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "createdToday", in: "query", schema: { type: "boolean" }, description: "Filtrar criados hoje" },
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
        ],
        responses: { "200": { description: "Lista de pacientes." } },
      },
    },
    "/patients/{id}": {
      get: {
        tags: ["Pacientes"],
        summary: "Buscar paciente por ID",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "200": { description: "Paciente encontrado." } },
      },
      put: {
        tags: ["Pacientes"],
        summary: "Atualizar paciente",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/UpdatePatientInput" } } } },
        responses: { "200": { description: "Paciente atualizado." } },
      },
      delete: {
        tags: ["Pacientes"],
        summary: "Deletar paciente",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "200": { description: "Paciente deletado." } },
      },
    },

    // ═══════════════════════════════════════════════════════════════════════
    //  APPOINTMENTS
    // ═══════════════════════════════════════════════════════════════════════
    "/appointments": {
      post: {
        tags: ["Consultas"],
        summary: "Criar consulta",
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CreateAppointmentInput" } } } },
        responses: { "201": { description: "Consulta criada." } },
      },
      get: {
        tags: ["Consultas"],
        summary: "Listar consultas (com filtros)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "userId", in: "query", schema: { type: "string", format: "uuid" } },
          { name: "patientId", in: "query", schema: { type: "string", format: "uuid" } },
          { name: "status", in: "query", schema: { type: "string", enum: ["SCHEDULED", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELED", "NO_SHOW", "CANCELLED"] } },
          { name: "date", in: "query", schema: { type: "string", format: "date" }, description: "Dia exato" },
          { name: "timeStart", in: "query", schema: { type: "string", pattern: "^\\d{2}:\\d{2}$" } },
          { name: "timeEnd", in: "query", schema: { type: "string", pattern: "^\\d{2}:\\d{2}$" } },
          { name: "dateStart", in: "query", schema: { type: "string", format: "date" } },
          { name: "dateEnd", in: "query", schema: { type: "string", format: "date" } },
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
        ],
        responses: { "200": { description: "Lista de consultas." } },
      },
    },
    "/appointments/events": {
      get: {
        tags: ["Consultas"],
        summary: "SSE — Eventos em tempo real (Server-Sent Events)",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Conexão SSE estabelecida",
            content: { "text/event-stream": { schema: { type: "string" } } },
          },
        },
      },
    },
    "/appointments/patient/{patientId}": {
      get: {
        tags: ["Consultas"],
        summary: "Listar consultas de um paciente",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "patientId", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          { name: "status", in: "query", schema: { type: "string", enum: ["SCHEDULED", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELED", "NO_SHOW", "CANCELLED"] } },
          { name: "date", in: "query", schema: { type: "string", format: "date" } },
          { name: "dateStart", in: "query", schema: { type: "string", format: "date" } },
          { name: "dateEnd", in: "query", schema: { type: "string", format: "date" } },
        ],
        responses: { "200": { description: "Lista de consultas do paciente." } },
      },
    },
    "/appointments/user/{userId}": {
      get: {
        tags: ["Consultas"],
        summary: "Listar consultas de um usuário (médico)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "userId", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          { name: "status", in: "query", schema: { type: "string" } },
          { name: "date", in: "query", schema: { type: "string", format: "date" } },
          { name: "dateStart", in: "query", schema: { type: "string", format: "date" } },
          { name: "dateEnd", in: "query", schema: { type: "string", format: "date" } },
        ],
        responses: { "200": { description: "Lista de consultas do médico." } },
      },
    },
    "/appointments/{id}": {
      get: {
        tags: ["Consultas"],
        summary: "Buscar consulta por ID",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "200": { description: "Consulta encontrada." } },
      },
      put: {
        tags: ["Consultas"],
        summary: "Atualizar consulta",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateAppointmentInput" } } } },
        responses: { "200": { description: "Consulta atualizada." } },
      },
      delete: {
        tags: ["Consultas"],
        summary: "Deletar consulta",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "200": { description: "Consulta deletada." } },
      },
    },
    "/appointments/{id}/whatsapp": {
      post: {
        tags: ["Consultas"],
        summary: "Enviar notificação WhatsApp/SMS da consulta",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/SendWhatsAppInput" } } } },
        responses: { "200": { description: "Notificação enviada/enfileirada." } },
      },
    },

    // ═══════════════════════════════════════════════════════════════════════
    //  MEDICAL RECORDS
    // ═══════════════════════════════════════════════════════════════════════
    "/medical-records": {
      post: {
        tags: ["Prontuários"],
        summary: "Criar prontuário",
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CreateMedicalRecordInput" } } } },
        responses: { "201": { description: "Prontuário criado." } },
      },
      get: {
        tags: ["Prontuários"],
        summary: "Listar prontuários",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "createdToday", in: "query", schema: { type: "boolean" } },
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
        ],
        responses: { "200": { description: "Lista de prontuários." } },
      },
    },
    "/medical-records/{id}": {
      get: {
        tags: ["Prontuários"],
        summary: "Buscar prontuário por ID",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "200": { description: "Prontuário encontrado." } },
      },
      put: {
        tags: ["Prontuários"],
        summary: "Atualizar prontuário",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateMedicalRecordInput" } } } },
        responses: { "200": { description: "Prontuário atualizado." } },
      },
      delete: {
        tags: ["Prontuários"],
        summary: "Deletar prontuário",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "200": { description: "Prontuário deletado." } },
      },
    },
    "/medical-records/patient/{patientId}": {
      get: {
        tags: ["Prontuários"],
        summary: "Listar prontuários de um paciente",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "patientId", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "200": { description: "Lista de prontuários do paciente." } },
      },
    },

    // ═══════════════════════════════════════════════════════════════════════
    //  PATIENT HISTORY
    // ═══════════════════════════════════════════════════════════════════════
    "/patients/{patientId}/history": {
      post: {
        tags: ["Histórico do Paciente"],
        summary: "Criar registro no histórico do paciente",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "patientId", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CreatePatientHistoryInput" } } } },
        responses: { "201": { description: "Registro criado." } },
      },
      get: {
        tags: ["Histórico do Paciente"],
        summary: "Listar histórico do paciente (paginado)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "patientId", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          { name: "type", in: "query", schema: { type: "string", enum: ["CONSULTA", "EXAME", "PRESCRICAO", "OBSERVACAO", "SOLICITACAO"] } },
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
        ],
        responses: { "200": { description: "Lista do histórico." } },
      },
    },
    "/history/{id}": {
      delete: {
        tags: ["Histórico do Paciente"],
        summary: "Soft delete de registro do histórico",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "200": { description: "Registro deletado (soft)." } },
      },
    },

    // ═══════════════════════════════════════════════════════════════════════
    //  SPECIALTIES
    // ═══════════════════════════════════════════════════════════════════════
    "/specialties": {
      get: {
        tags: ["Especialidades"],
        summary: "Listar especialidades",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Lista de especialidades." } },
      },
    },
    "/specialties/doctor/{doctorId}": {
      get: {
        tags: ["Especialidades"],
        summary: "Listar especialidades de um médico",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "doctorId", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "200": { description: "Especialidades do médico." } },
      },
    },

    // ═══════════════════════════════════════════════════════════════════════
    //  FINANCIAL ACCOUNTS
    // ═══════════════════════════════════════════════════════════════════════
    "/financial/accounts": {
      post: {
        tags: ["Financeiro — Contas"],
        summary: "Criar conta financeira (ADMIN)",
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CreateFinancialAccountInput" } } } },
        responses: { "201": { description: "Conta criada." } },
      },
      get: {
        tags: ["Financeiro — Contas"],
        summary: "Listar contas financeiras (ADMIN)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "isActive", in: "query", schema: { type: "boolean" } },
          { name: "type", in: "query", schema: { type: "string", enum: ["CHECKING", "SAVINGS", "CASH", "CREDIT_CARD", "INVESTMENT"] } },
        ],
        responses: { "200": { description: "Lista de contas." } },
      },
    },
    "/financial/accounts/{id}": {
      get: {
        tags: ["Financeiro — Contas"],
        summary: "Buscar conta financeira por ID (ADMIN)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "200": { description: "Conta encontrada." } },
      },
      put: {
        tags: ["Financeiro — Contas"],
        summary: "Atualizar conta financeira (ADMIN)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateFinancialAccountInput" } } } },
        responses: { "200": { description: "Conta atualizada." } },
      },
      delete: {
        tags: ["Financeiro — Contas"],
        summary: "Deletar conta financeira (ADMIN)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "204": { description: "Conta deletada." } },
      },
    },

    // ═══════════════════════════════════════════════════════════════════════
    //  FINANCIAL CATEGORIES
    // ═══════════════════════════════════════════════════════════════════════
    "/financial/categories": {
      post: {
        tags: ["Financeiro — Categorias"],
        summary: "Criar categoria financeira",
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CreateFinancialCategoryInput" } } } },
        responses: { "201": { description: "Categoria criada." } },
      },
      get: {
        tags: ["Financeiro — Categorias"],
        summary: "Listar categorias financeiras",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "type", in: "query", schema: { type: "string", enum: ["INCOME", "EXPENSE", "BOTH"] } },
          { name: "isActive", in: "query", schema: { type: "boolean" } },
        ],
        responses: { "200": { description: "Lista de categorias." } },
      },
    },
    "/financial/categories/{id}": {
      get: {
        tags: ["Financeiro — Categorias"],
        summary: "Buscar categoria por ID",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "200": { description: "Categoria encontrada." } },
      },
      put: {
        tags: ["Financeiro — Categorias"],
        summary: "Atualizar categoria financeira",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateFinancialCategoryInput" } } } },
        responses: { "200": { description: "Categoria atualizada." } },
      },
      delete: {
        tags: ["Financeiro — Categorias"],
        summary: "Deletar categoria financeira",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "204": { description: "Categoria deletada." } },
      },
    },

    // ═══════════════════════════════════════════════════════════════════════
    //  FINANCIAL TRANSACTIONS
    // ═══════════════════════════════════════════════════════════════════════
    "/financial/transactions": {
      post: {
        tags: ["Financeiro — Transações"],
        summary: "Criar transação financeira",
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CreateTransactionInput" } } } },
        responses: { "201": { description: "Transação criada." } },
      },
      get: {
        tags: ["Financeiro — Transações"],
        summary: "Listar transações (com filtros)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "accountId", in: "query", schema: { type: "string", format: "uuid" } },
          { name: "categoryId", in: "query", schema: { type: "string", format: "uuid" } },
          { name: "patientId", in: "query", schema: { type: "string", format: "uuid" } },
          { name: "appointmentId", in: "query", schema: { type: "string", format: "uuid" } },
          { name: "type", in: "query", schema: { type: "string", enum: ["INCOME", "EXPENSE", "TRANSFER"] } },
          { name: "status", in: "query", schema: { type: "string", enum: ["PENDING", "CONFIRMED", "CANCELLED"] } },
          { name: "paymentMethod", in: "query", schema: { type: "string", enum: ["CASH", "CREDIT_CARD", "DEBIT_CARD", "PIX", "BANK_TRANSFER", "INSURANCE", "OTHER"] } },
          { name: "dateStart", in: "query", schema: { type: "string", format: "date" } },
          { name: "dateEnd", in: "query", schema: { type: "string", format: "date" } },
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
        ],
        responses: { "200": { description: "Lista de transações." } },
      },
    },
    "/financial/transactions/{id}": {
      get: {
        tags: ["Financeiro — Transações"],
        summary: "Buscar transação por ID",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "200": { description: "Transação encontrada." } },
      },
      put: {
        tags: ["Financeiro — Transações"],
        summary: "Atualizar transação",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateTransactionInput" } } } },
        responses: { "200": { description: "Transação atualizada." } },
      },
      delete: {
        tags: ["Financeiro — Transações"],
        summary: "Deletar transação (soft delete)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "204": { description: "Transação deletada." } },
      },
    },

    // ═══════════════════════════════════════════════════════════════════════
    //  FINANCIAL DASHBOARD
    // ═══════════════════════════════════════════════════════════════════════
    "/financial/dashboard": {
      get: {
        tags: ["Financeiro — Dashboard"],
        summary: "Dashboard financeiro (últimos 6 meses, ADMIN)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "month", in: "query", schema: { type: "string", pattern: "^\\d{4}-\\d{2}$" }, description: "Mês de referência (YYYY-MM). Default: mês atual." },
        ],
        responses: { "200": { description: "Dados do dashboard.", content: { "application/json": { schema: { $ref: "#/components/schemas/DashboardResponse" } } } } },
      },
    },

    // ═══════════════════════════════════════════════════════════════════════
    //  EMPLOYEES
    // ═══════════════════════════════════════════════════════════════════════
    "/employees": {
      post: {
        tags: ["RH — Funcionários"],
        summary: "Criar funcionário (ADMIN)",
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CreateEmployeeInput" } } } },
        responses: { "201": { description: "Funcionário criado." } },
      },
      get: {
        tags: ["RH — Funcionários"],
        summary: "Listar funcionários (ADMIN)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "search", in: "query", schema: { type: "string" }, description: "Busca por nome, cargo, departamento" },
          { name: "status", in: "query", schema: { type: "string", enum: ["ACTIVE", "INACTIVE", "ON_LEAVE", "TERMINATED"] } },
          { name: "department", in: "query", schema: { type: "string" } },
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
        ],
        responses: { "200": { description: "Lista de funcionários." } },
      },
    },
    "/employees/{id}": {
      get: {
        tags: ["RH — Funcionários"],
        summary: "Buscar funcionário por ID (ADMIN)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "200": { description: "Funcionário encontrado." } },
      },
      put: {
        tags: ["RH — Funcionários"],
        summary: "Atualizar funcionário (ADMIN)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateEmployeeInput" } } } },
        responses: { "200": { description: "Funcionário atualizado." } },
      },
      delete: {
        tags: ["RH — Funcionários"],
        summary: "Deletar funcionário (ADMIN)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "200": { description: "Funcionário deletado." } },
      },
    },

    // ═══════════════════════════════════════════════════════════════════════
    //  NOTAS FISCAIS
    // ═══════════════════════════════════════════════════════════════════════
    "/fiscal/notas-fiscais": {
      post: {
        tags: ["Fiscal — Notas Fiscais"],
        summary: "Criar nota fiscal (ADMIN)",
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CreateNotaFiscalInput" } } } },
        responses: { "201": { description: "Nota fiscal criada." } },
      },
      get: {
        tags: ["Fiscal — Notas Fiscais"],
        summary: "Listar notas fiscais (ADMIN)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "status", in: "query", schema: { type: "string", enum: ["PENDENTE", "PROCESSANDO", "ERRO", "EMITIDA", "CANCELADA"] } },
          { name: "patientId", in: "query", schema: { type: "string", format: "uuid" } },
          { name: "dateStart", in: "query", schema: { type: "string", format: "date" } },
          { name: "dateEnd", in: "query", schema: { type: "string", format: "date" } },
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
        ],
        responses: { "200": { description: "Lista de notas fiscais." } },
      },
    },
    "/fiscal/notas-fiscais/{id}": {
      get: {
        tags: ["Fiscal — Notas Fiscais"],
        summary: "Buscar nota fiscal por ID (ADMIN)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "200": { description: "Nota fiscal encontrada." } },
      },
      put: {
        tags: ["Fiscal — Notas Fiscais"],
        summary: "Atualizar nota fiscal (ADMIN)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateNotaFiscalInput" } } } },
        responses: { "200": { description: "Nota fiscal atualizada." } },
      },
      delete: {
        tags: ["Fiscal — Notas Fiscais"],
        summary: "Remover nota fiscal (ADMIN)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "200": { description: "Nota fiscal removida." } },
      },
    },
    "/fiscal/notas-fiscais/{id}/emitir": {
      post: {
        tags: ["Fiscal — Notas Fiscais"],
        summary: "Emitir nota fiscal (ADMIN)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "200": { description: "Nota fiscal emitida." } },
      },
    },
    "/fiscal/notas-fiscais/{id}/cancelar": {
      post: {
        tags: ["Fiscal — Notas Fiscais"],
        summary: "Cancelar nota fiscal (ADMIN)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "200": { description: "Nota fiscal cancelada." } },
      },
    },
    "/patients/{patientId}/notas-fiscais": {
      get: {
        tags: ["Fiscal — Notas Fiscais"],
        summary: "Listar notas fiscais de um paciente",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "patientId", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
        ],
        responses: { "200": { description: "Lista de notas fiscais do paciente." } },
      },
    },

    // ═══════════════════════════════════════════════════════════════════════
    //  TRANSCRIBE
    // ═══════════════════════════════════════════════════════════════════════
    "/transcribe": {
      post: {
        tags: ["Transcrição"],
        summary: "Transcrever áudio (via Groq Whisper)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  file: { type: "string", format: "binary", description: "Arquivo de áudio (webm, mp3, wav, ogg, flac, aac, mp4)" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Texto transcrito",
            content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { type: "object", properties: { text: { type: "string" } } } } } } },
          },
        },
      },
    },

    // ═══════════════════════════════════════════════════════════════════════
    //  PASSWORD
    // ═══════════════════════════════════════════════════════════════════════
    "/password/forgot": {
      post: {
        tags: ["Senha"],
        summary: "Solicitar redefinição de senha",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/ForgotPasswordInput" } } } },
        responses: { "201": { description: "E-mail de redefinição enviado." } },
      },
    },
    "/password/reset": {
      post: {
        tags: ["Senha"],
        summary: "Redefinir senha com token",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/ResetPasswordInput" } } } },
        responses: { "200": { description: "Senha redefinida." } },
      },
    },

    // ═══════════════════════════════════════════════════════════════════════
    //  SUS PROCEDURES
    // ═══════════════════════════════════════════════════════════════════════
    "/sus-procedures": {
      get: {
        tags: ["SUS — Procedimentos"],
        summary: "Listar procedimentos SUS",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Lista de procedimentos." } },
      },
    },
    "/sus-procedures/{codigo}": {
      get: {
        tags: ["SUS — Procedimentos"],
        summary: "Buscar procedimento SUS por código",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "codigo", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Procedimento encontrado." } },
      },
    },
    "/sus-procedures/sync": {
      post: {
        tags: ["SUS — Procedimentos"],
        summary: "Sincronizar procedimentos SUS (via SIGTAP)",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Sincronização concluída." } },
      },
    },
  },
};

export const swaggerUiOptions: swaggerUi.SwaggerUiOptions = {
  customCss: ".swagger-ui .topbar { display: none } .swagger-ui .info { margin: 20px 0 }",
  customSiteTitle: "ADQPAL — API Docs",
  customfavIcon: "",
  // CDN evita depender de express.static em node_modules no serverless
  customCssUrl:
    "https://unpkg.com/swagger-ui-dist@5/swagger-ui.css",
  swaggerUrl: "/api-docs.json",
};
