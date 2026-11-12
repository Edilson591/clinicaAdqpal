import type { RefObject, ReactNode } from "react";
import type { AihData } from "../../hooks/useAihLaudoPage";
import {
  SearchableSelectGroup,
  type SearchableOption,
} from "../../components/ui/SearchableSelect";
import { CharBoxGrid } from "./CharBoxGrid";

interface AihFormProps {
  data: AihData;
  formRef: RefObject<HTMLDivElement | null>;
  update: (key: keyof AihData, value: AihData[keyof AihData]) => void;
  cidOptions: SearchableOption[];
  onCidSelect: (code: string) => void;
}

type Update = AihFormProps["update"];

function Section({
  title,
  className,
  children,
}: {
  title: string;
  className: string;
  children: ReactNode;
}) {
  return (
    <section className={`aih-section ${className}`}>
      <h3><span>{title}</span></h3>
      <div className="aih-section-body">{children}</div>
    </section>
  );
}

function Field({
  data,
  update,
  name,
  label,
  className = "",
  maxLength,
}: {
  data: AihData;
  update: Update;
  name: keyof AihData;
  label: string;
  className?: string;
  maxLength?: number;
}) {
  return (
    <label className={`aih-field ${className}`}>
      <span>{label}</span>
      <input
        value={String(data[name] ?? "")}
        maxLength={maxLength}
        onChange={(event) => update(name, event.target.value)}
      />
    </label>
  );
}

function TextField({
  data,
  update,
  name,
  label,
  className = "",
}: {
  data: AihData;
  update: Update;
  name: keyof AihData;
  label: string;
  className?: string;
}) {
  return (
    <label className={`aih-field aih-text ${className}`}>
      <span>{label}</span>
      <textarea
        value={String(data[name] ?? "")}
        onChange={(event) => update(name, event.target.value)}
      />
    </label>
  );
}

function BoxField({
  data,
  update,
  name,
  label,
  length,
  className = "",
}: {
  data: AihData;
  update: Update;
  name: keyof AihData;
  label: string;
  length: number;
  className?: string;
}) {
  const digits = String(data[name] ?? "").replace(/\D/g, "");
  const values = Array.from({ length }, (_, index) => digits[index] ?? "");

  return (
    <div className={`aih-field ${className}`}>
      <span>{label}</span>
      <CharBoxGrid
        values={values}
        onChange={(next) => update(name, next.join(""))}
        length={length}
        className="aih-box-grid"
        boxClassName="aih-box"
      />
    </div>
  );
}

function DateField({
  data,
  update,
  name,
  label,
  className = "",
}: {
  data: AihData;
  update: Update;
  name: keyof AihData;
  label: string;
  className?: string;
}) {
  const digits = String(data[name] ?? "").replace(/\D/g, "").slice(0, 8);
  const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)];
  const changePart = (index: number, value: string) => {
    const next = [...parts];
    next[index] = value.replace(/\D/g, "").slice(0, index === 2 ? 4 : 2);
    update(name, next.join(""));
  };

  return (
    <div className={`aih-field ${className}`}>
      <span>{label}</span>
      <div className="aih-date">
        <input value={parts[0]} onChange={(e) => changePart(0, e.target.value)} aria-label={`${label} dia`} />
        <b>/</b>
        <input value={parts[1]} onChange={(e) => changePart(1, e.target.value)} aria-label={`${label} mês`} />
        <b>/</b>
        <input className="year" value={parts[2]} onChange={(e) => changePart(2, e.target.value)} aria-label={`${label} ano`} />
      </div>
    </div>
  );
}

function Choice({
  selected,
  onSelect,
  children,
}: {
  selected: boolean;
  onSelect: () => void;
  children: ReactNode;
}) {
  return (
    <label className="aih-choice">
      <input type="checkbox" checked={selected} onChange={onSelect} />
      <i>({selected ? "X" : " "})</i>
      <span>{children}</span>
    </label>
  );
}

function DocumentType({
  data,
  update,
  name,
  number,
}: {
  data: AihData;
  update: Update;
  name: "f28DocumentoTipo" | "f45DocumentoTipo";
  number: number;
}) {
  return (
    <div className="aih-field aih-document-type">
      <span>{number} - DOCUMENTO</span>
      <div>
        <Choice selected={data[name] === "CNS"} onSelect={() => update(name, "CNS")}>CNS</Choice>
        <Choice selected={data[name] === "CPF"} onSelect={() => update(name, "CPF")}>CPF</Choice>
      </div>
    </div>
  );
}

export function AihForm({
  data,
  formRef,
  update,
  cidOptions,
  onCidSelect,
}: AihFormProps) {
  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-xl shadow-sm border border-[#E2E8F0] dark:border-[#334155] p-3 sm:p-6 overflow-hidden">
      <div className="no-print mb-5">
        <SearchableSelectGroup
          label="Buscar CID / diagnóstico"
          placeholder="Código ou descrição do CID..."
          options={cidOptions}
          value={data.f21CidPrincipal}
          onChange={onCidSelect}
          helperText="Preenche o diagnóstico inicial e o CID principal."
        />
      </div>

      <div className="max-h-[calc(100dvh-18rem)] w-full overflow-auto print:max-h-none print:overflow-visible">
        <div className="flex min-w-max justify-center pb-2 print:min-w-0 print:pb-0">
          <div ref={formRef} id="aih-form" className="aih-page">
            <div className="aih-annex">Anexo I</div>
            <header className="aih-header">
              <div className="aih-brand">
                <div className="aih-sus-symbol"><span>SUS</span></div>
                <div><b>Sistema<br />Único de<br />Saúde</b></div>
                <div><b>Ministério<br />da<br />Saúde</b></div>
              </div>
              <h2>LAUDO PARA SOLICITAÇÃO DE AUTORIZAÇÃO<br />DE INTERNAÇÃO HOSPITALAR</h2>
            </header>

            <Section title="Identificação do Estabelecimento de Saúde" className="aih-establishment">
              <div className="aih-row">
                <Field data={data} update={update} name="f1EstabelecimentoSolicitante" label="1 - NOME DO ESTABELECIMENTO SOLICITANTE" className="w-[82%]" />
                <BoxField data={data} update={update} name="f2CnesSolicitante" label="2 - CNES" length={7} className="w-[18%]" />
              </div>
              <div className="aih-row">
                <Field data={data} update={update} name="f3EstabelecimentoExecutante" label="3 - NOME DO ESTABELECIMENTO EXECUTANTE" className="w-[82%]" />
                <BoxField data={data} update={update} name="f4CnesExecutante" label="4 - CNES" length={7} className="w-[18%]" />
              </div>
            </Section>

            <Section title="Identificação do Paciente" className="aih-patient">
              <div className="aih-row">
                <Field data={data} update={update} name="f5Paciente" label="5 - NOME DO PACIENTE" className="w-[82%]" />
                <Field data={data} update={update} name="f6Prontuario" label="6 - Nº DO PRONTUÁRIO" className="w-[18%]" />
              </div>
              <div className="aih-row">
                <BoxField data={data} update={update} name="f7Cns" label="7 - CARTÃO NACIONAL DE SAÚDE (CNS)" length={15} className="w-[51%]" />
                <DateField data={data} update={update} name="f8Nascimento" label="8 - DATA DE NASCIMENTO" className="w-[21%]" />
                <div className="aih-field aih-sex w-[28%]"><span>9 - SEXO</span><div><label>Masc. <button type="button" onClick={() => update("f9Sexo", "M")}>{data.f9Sexo === "M" ? "X" : "1"}</button></label><label>Fem. <button type="button" onClick={() => update("f9Sexo", "F")}>{data.f9Sexo === "F" ? "X" : "3"}</button></label></div></div>
              </div>
              <div className="aih-row">
                <Field data={data} update={update} name="f10MaeResponsavel" label="10 - NOME DA MÃE OU RESPONSÁVEL" className="w-[70%]" />
                <BoxField data={data} update={update} name="f11Ddd" label="11 - TELEFONE DE CONTATO / DDD" length={2} className="w-[7%]" />
                <BoxField data={data} update={update} name="f11Telefone" label="Nº DO TELEFONE" length={9} className="w-[23%]" />
              </div>
              <div className="aih-row"><Field data={data} update={update} name="f12Endereco" label="12 - ENDEREÇO (RUA, Nº, BAIRRO)" /></div>
              <div className="aih-row">
                <Field data={data} update={update} name="f13Municipio" label="13 - MUNICÍPIO DE RESIDÊNCIA" className="w-[59%]" />
                <BoxField data={data} update={update} name="f14Ibge" label="14 - CÓD. IBGE MUNICÍPIO" length={7} className="w-[15%]" />
                <Field data={data} update={update} name="f15Uf" label="15 - UF" className="w-[6%]" maxLength={2} />
                <BoxField data={data} update={update} name="f16Cep" label="16 - CEP" length={8} className="w-[20%]" />
              </div>
            </Section>

            <Section title="JUSTIFICATIVA DA INTERNAÇÃO" className="aih-justification-section">
              <TextField data={data} update={update} name="f17SinaisSintomas" label="17 - PRINCIPAIS SINAIS E SINTOMAS CLÍNICOS" className="aih-signs" />
              <TextField data={data} update={update} name="f18Condicoes" label="18 - CONDIÇÕES QUE JUSTIFICAM A INTERNAÇÃO" className="aih-conditions" />
              <TextField data={data} update={update} name="f19Resultados" label="19 - PRINCIPAIS RESULTADOS DE PROVAS DIAGNÓSTICAS (RESULTADOS DE EXAMES REALIZADOS)" className="aih-results" />
              <div className="aih-row aih-diagnosis-row">
                <Field data={data} update={update} name="f20Diagnostico" label="20 - DIAGNÓSTICO INICIAL" className="w-[44%]" />
                <Field data={data} update={update} name="f21CidPrincipal" label="21 - CID 10 PRINCIPAL" className="w-[17%]" />
                <Field data={data} update={update} name="f22CidSecundario" label="22 - CID 10 SECUNDÁRIO" className="w-[18%]" />
                <Field data={data} update={update} name="f23CidAssociado" label="23 - CID 10 CAUSAS ASSOCIADAS" className="w-[21%]" />
              </div>
            </Section>

            <Section title="PROCEDIMENTO SOLICITADO" className="aih-procedure">
              <div className="aih-row">
                <Field data={data} update={update} name="f24Procedimento" label="24 - DESCRIÇÃO DO PROCEDIMENTO SOLICITADO" className="w-[75%]" />
                <Field data={data} update={update} name="f25CodigoProcedimento" label="25 - CÓDIGO DO PROCEDIMENTO" className="w-[25%]" maxLength={10} />
              </div>
              <div className="aih-row">
                <Field data={data} update={update} name="f26Clinica" label="26 - CLÍNICA" className="w-[20%]" />
                <Field data={data} update={update} name="f27CaraterInternacao" label="27 - CARÁTER DA INTERNAÇÃO" className="w-[20%]" />
                <DocumentType data={data} update={update} name="f28DocumentoTipo" number={28} />
                <BoxField data={data} update={update} name="f29DocumentoProfissional" label="29 - Nº DOCUMENTO (CNS/CPF) DO PROFISSIONAL SOLICITANTE/ASSISTENTE" length={data.f28DocumentoTipo === "CPF" ? 11 : 15} className="w-[43%]" />
              </div>
              <div className="aih-row">
                <Field data={data} update={update} name="f30ProfissionalSolicitante" label="30 - NOME DO PROFISSIONAL SOLICITANTE/ASSISTENTE" className="w-[48%]" />
                <DateField data={data} update={update} name="f31DataSolicitacao" label="31 - DATA DA SOLICITAÇÃO" className="w-[16%]" />
                <div className="aih-field w-[36%]"><span>32-A - ASSINATURA E CARIMBO (Nº DO REGISTRO DO CONSELHO)</span></div>
              </div>
            </Section>

            <Section title="PREENCHER EM CASO DE CAUSAS EXTERNAS (ACIDENTES OU VIOLÊNCIAS)" className="aih-external">
              <div className="aih-external-main">
                <div className="aih-accidents">
                  <Choice selected={data.f33AcidenteTransito} onSelect={() => update("f33AcidenteTransito", !data.f33AcidenteTransito)}>33 - ACIDENTE DE TRÂNSITO</Choice>
                  <Choice selected={data.f34AcidenteTrabalhoTipico} onSelect={() => update("f34AcidenteTrabalhoTipico", !data.f34AcidenteTrabalhoTipico)}>34 - ACIDENTE TRABALHO TÍPICO</Choice>
                  <Choice selected={data.f35AcidenteTrabalhoTrajeto} onSelect={() => update("f35AcidenteTrabalhoTrajeto", !data.f35AcidenteTrabalhoTrajeto)}>35 - ACIDENTE TRABALHO TRAJETO</Choice>
                </div>
                <div className="aih-external-fields">
                  <div className="aih-row"><BoxField data={data} update={update} name="f36CnpjSeguradora" label="36 - CNPJ DA SEGURADORA" length={14} className="w-[56%]" /><Field data={data} update={update} name="f37Bilhete" label="37 - Nº DO BILHETE" className="w-[29%]" /><Field data={data} update={update} name="f38Serie" label="38 - SÉRIE" className="w-[15%]" /></div>
                  <div className="aih-row"><BoxField data={data} update={update} name="f39CnpjEmpresa" label="39 - CNPJ DA EMPRESA" length={14} className="w-[56%]" /><Field data={data} update={update} name="f40Cnae" label="40 - CNAE DA EMPRESA" className="w-[29%]" /><Field data={data} update={update} name="f41Cbor" label="41 - CBOR" className="w-[15%]" /></div>
                </div>
              </div>
              <div className="aih-previdencia"><span>42 - VÍNCULO COM A PREVIDÊNCIA</span>{["EMPREGADO", "EMPREGADOR", "AUTÔNOMO", "DESEMPREGADO", "APOSENTADO", "NÃO SEGURADO"].map((option) => <Choice key={option} selected={data.f42VinculoPrevidencia === option} onSelect={() => update("f42VinculoPrevidencia", option)}>{option}</Choice>)}</div>
            </Section>

            <Section title="AUTORIZAÇÃO" className="aih-authorization">
              <div className="aih-auth-left">
                <div className="aih-row"><Field data={data} update={update} name="f43ProfissionalAutorizador" label="43 - NOME DO PROFISSIONAL AUTORIZADOR" className="w-[72%]" /><Field data={data} update={update} name="f44OrgaoEmissor" label="44 - CÓD. ÓRGÃO EMISSOR" className="w-[28%]" /></div>
                <div className="aih-row"><DocumentType data={data} update={update} name="f45DocumentoTipo" number={45} /><BoxField data={data} update={update} name="f46DocumentoAutorizador" label="46 - Nº DOCUMENTO (CNS/CPF) DO PROFISSIONAL AUTORIZADOR" length={data.f45DocumentoTipo === "CPF" ? 11 : 15} className="w-[79%]" /></div>
                <div className="aih-row"><DateField data={data} update={update} name="f47DataAutorizacao" label="47 - DATA DA AUTORIZAÇÃO" className="w-[27%]" /><div className="aih-field w-[73%]"><span>48 - ASSINATURA E CARIMBO (Nº DO REGISTRO DO CONSELHO)</span></div></div>
              </div>
              <Field data={data} update={update} name="f49NumeroAih" label="49 - Nº DA AUTORIZAÇÃO DE INTERNAÇÃO HOSPITALAR" className="aih-number-aih" />
            </Section>
          </div>
        </div>
      </div>

      <style>{`
        .aih-page { width: 188mm; min-height: 270mm; background: #fff; color: #000; padding: 0; font-family: "Arial Narrow", Arial, sans-serif; box-shadow: 0 1px 5px #888; }
        .aih-annex { height: 5mm; display: grid; place-items: center; font: 700 8pt Georgia, serif; }
        .aih-header { height: 15mm; display: flex; border: .45mm solid #000; }
        .aih-brand { width: 30%; display: flex; align-items: center; justify-content: space-around; border-right: .3mm solid #000; padding: 1mm; font-size: 6.5pt; line-height: 1.15; }
        .aih-sus-symbol { width: 14mm; height: 10mm; display: grid; place-items: end center; border: .4mm solid #000; transform: skew(-4deg); }
        .aih-sus-symbol span { background: #fff; padding: 0 1mm; font-size: 11pt; font-weight: 900; transform: skew(4deg); }
        .aih-header h2 { flex: 1; display: grid; place-items: center; text-align: center; font-size: 13pt; font-style: italic; font-weight: 900; line-height: 1.05; }
        .aih-section { position: relative; margin-top: 2mm; border: .45mm solid #000; border-radius: 3mm; overflow: visible; }
        .aih-section h3 { position: absolute; z-index: 2; top: -2.6mm; left: 0; right: 0; margin: 0; text-align: center; font-size: 10pt; line-height: 5mm; font-weight: 900; }
        .aih-section h3 span { background: #fff; padding: 0 2mm; }
        .aih-section-body { height: 100%; padding-top: 2.5mm; overflow: hidden; border-radius: 3mm; }
        .aih-establishment { height: 20mm; }
        .aih-patient { height: 43mm; }
        .aih-justification-section { height: 87mm; }
        .aih-procedure { height: 31mm; }
        .aih-external { height: 28mm; }
        .aih-authorization { height: 31mm; }
        .aih-establishment .aih-section-body, .aih-patient .aih-section-body, .aih-procedure .aih-section-body { display: flex; flex-direction: column; }
        .aih-row { display: flex; flex: 1; min-height: 0; border-top: .25mm solid #000; }
        .aih-section-body > .aih-row:first-child { border-top: 0; }
        .aih-field { flex: 1; min-width: 0; display: flex; flex-direction: column; border-right: .25mm solid #000; padding: .35mm .6mm; overflow: hidden; }
        .aih-field[class*="w-["] { flex: none; }
        .aih-field:last-child { border-right: 0; }
        .aih-field > span { min-height: 2.7mm; font-size: 6.2pt; line-height: 1.05; overflow: hidden; }
        .aih-field > input, .aih-field > textarea { flex: 1; min-width: 0; width: 100%; border: 0; outline: 0; background: transparent; font: 700 8.5pt "Arial Narrow", Arial, sans-serif; padding: 0 .4mm; resize: none; }
        .aih-field > input:focus, .aih-field > textarea:focus { background: #fffde7; }
        .aih-box-grid { display: flex; flex: 1; align-items: end; width: 100%; }
        .aih-box { flex: 1; min-width: 0; width: auto; height: 4.3mm; border: .2mm solid #000; border-right: 0; text-align: center; font: 700 8pt Arial, sans-serif; outline: 0; padding: 0; background: transparent; }
        .aih-box:last-child { border-right: .2mm solid #000; }
        .aih-box:focus { background: #fffde7; }
        .aih-date { flex: 1; display: flex; align-items: end; justify-content: center; gap: .5mm; padding-bottom: .5mm; }
        .aih-date input { width: 5mm; border: 0; border-bottom: .2mm solid #000; outline: 0; text-align: center; font: 700 8.5pt Arial, sans-serif; }
        .aih-date input.year { width: 8mm; }
        .aih-date b { font-size: 9pt; }
        .aih-sex > div { flex: 1; display: flex; align-items: center; justify-content: space-around; font-size: 7pt; }
        .aih-sex label { display: flex; align-items: center; gap: 1mm; }
        .aih-sex button { width: 5mm; height: 5mm; border: .25mm solid #000; background: #fff; font: 700 8pt Arial; padding: 0; }
        .aih-text { border-top: .25mm solid #000; }
        .aih-signs { height: 42mm; border-top: 0; }
        .aih-conditions { height: 18mm; background-image: linear-gradient(to right, transparent 58%, #000 58%, #000 calc(58% + .2mm), transparent calc(58% + .2mm)); }
        .aih-results { height: 18mm; }
        .aih-diagnosis-row { height: 8.5mm; flex: none; }
        .aih-document-type { width: 17%; flex: none; }
        .aih-document-type > div { flex: 1; display: flex; align-items: center; justify-content: space-around; }
        .aih-choice { display: flex; align-items: center; gap: .4mm; white-space: nowrap; cursor: pointer; font-size: 6.2pt; font-weight: 700; }
        .aih-choice input { position: absolute; opacity: 0; pointer-events: none; }
        .aih-choice i { font-style: normal; font-family: monospace; }
        .aih-external-main { height: 17mm; display: flex; }
        .aih-accidents { width: 25%; display: flex; flex-direction: column; justify-content: space-around; padding: .5mm 1mm; border-right: .25mm solid #000; }
        .aih-external-fields { width: 75%; display: flex; flex-direction: column; }
        .aih-external-fields .aih-row:first-child { border-top: 0; }
        .aih-previdencia { height: 9.5mm; display: flex; align-items: center; justify-content: space-around; border-top: .25mm solid #000; padding: 0 1mm; }
        .aih-previdencia > span { font-size: 6.2pt; font-weight: 700; }
        .aih-authorization .aih-section-body { display: flex; }
        .aih-auth-left { width: 67%; display: flex; flex-direction: column; border-right: .25mm solid #000; }
        .aih-auth-left .aih-row:first-child { border-top: 0; }
        .aih-number-aih { width: 33%; flex: none; border: 0; }
        @media print { .aih-page { box-shadow: none; } }
      `}</style>
    </div>
  );
}
