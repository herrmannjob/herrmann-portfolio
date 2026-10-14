// End-to-end check against a running server: node tests/e2e.mjs [baseURL]
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
const BASE = process.argv[2] || "http://localhost:3100";
const PW = process.env.ADMIN_PASSWORD || "test-password-123";
const exe = process.env.CHROME_PATH;
const browser = await chromium.launch(exe ? { executablePath: exe } : {});
const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, locale: "en-US" });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("dialog", (d) => d.accept());
let n = 0;
const ok = (msg) => console.log(`✓ ${++n}. ${msg}`);
const expect = (cond, msg) => { if (!cond) throw new Error(`✗ ${msg}`); ok(msg); };

await page.goto(`${BASE}/admin`);
expect(page.url().endsWith("/admin/login"), "redirects to login without a session");

await page.fill("#password", "wrong-password!!");
await page.click("button[type=submit]");
await page.locator("p[role=alert]").waitFor();
expect((await page.locator("p[role=alert]").textContent()).includes("incorreta"), "rejects wrong password");

await page.fill("#password", PW);
await page.click("button[type=submit]");
await page.waitForURL(`${BASE}/admin`);
expect(await page.getByTestId("row-zup-innovation").isVisible(), "logs in and lists seeded opportunities");

await page.getByRole("button", { name: "Nova oportunidade" }).click();
await page.waitForURL(/\/admin\/works\//);
const company = page.getByLabel("Empresa / nome *");
await company.fill("Teste Corp");
await page.getByLabel("Cargo").fill("Staff Engineer");
await page.getByLabel("Início").fill("2026-01");
await page.locator("textarea").nth(0).fill("Resumo de teste.");
await page.getByLabel("Publicado no site").check();
ok("creates a new opportunity and fills the form");

await page.getByRole("button", { name: "Adicionar imagens" }).click();
const dialog = page.getByRole("dialog");
await dialog.getByTestId("file-input").setInputFiles(fileURLToPath(new URL("./fixtures/test.png", import.meta.url)));
await dialog.getByText("1 selecionada(s)").waitFor({ timeout: 15000 });
await dialog.getByTestId("file-input").setInputFiles(fileURLToPath(new URL("./fixtures/bad.png", import.meta.url)));
await dialog.getByText("formato não suportado").waitFor();
ok("uploads an image with progress and rejects an invalid file");
await dialog.getByRole("button", { name: "Usar selecionadas" }).click();
expect((await page.getByTestId("gallery").locator("li").count()) === 1, "adds uploaded image to the gallery");

await page.getByRole("button", { name: "Salvar", exact: true }).click();
await page.getByText("Salvo.").waitFor();
ok("saves the opportunity");

const pub = await browser.newPage({ locale: "en-US" });
await pub.goto(`${BASE}/work/teste-corp`);
expect((await pub.locator("h1").textContent()).includes("Teste Corp"), "new opportunity has a public case page");
const galleryImg = pub.locator('section[aria-label="Gallery"] img').first();
await galleryImg.waitFor();
const nat = await galleryImg.evaluate((i) => i.naturalWidth);
expect(nat === 1200, "uploaded image is served from /media/uploads");
await pub.locator('section[aria-label="Gallery"] button').first().click();
await pub.getByRole("dialog").waitFor();
await pub.keyboard.press("Escape");
expect((await pub.getByRole("dialog").count()) === 0, "lightbox opens and closes with Esc");
await pub.goto(`${BASE}/#archive`);
expect(await pub.getByRole("link", { name: /Teste Corp/ }).first().isVisible(), "appears in the public archive");

// Image in use cannot be deleted
await page.goto(`${BASE}/admin/media`);
const used = page.getByTestId("media-card").filter({ hasText: "Teste Corp · galeria" });
expect(await used.getByRole("button", { name: "" }).last().isDisabled(), "blocks deleting an image that is in use");

// Remove image from gallery
await page.goto(`${BASE}/admin`);
await page.getByTestId("row-teste-corp").getByRole("link").first().click();
await page.getByRole("button", { name: "Remover imagem 1 da galeria" }).click();
await page.getByRole("button", { name: "Salvar", exact: true }).click();
await page.getByText("Salvo.").waitFor();
await pub.goto(`${BASE}/work/teste-corp`);
expect((await pub.locator('section[aria-label="Gallery"]').count()) === 0, "removing an image updates the public page");

// Toggle publish from the board
await page.goto(`${BASE}/admin`);
await page.getByTestId("row-teste-corp").getByRole("button", { name: "Ocultar do site" }).click();
await page.waitForTimeout(800);
const r = await pub.goto(`${BASE}/work/teste-corp`);
expect(r.status() === 404, "unpublishing hides the case page");

// Settings persist
await page.goto(`${BASE}/admin/settings`);
await page.getByLabel("Telefone / WhatsApp").fill("+55 51 0000-0000");
await page.getByRole("button", { name: "Salvar", exact: true }).click();
await page.getByText("Configurações salvas.").waitFor();
await pub.goto(`${BASE}/#contact`);
expect(await pub.getByText("+55 51 0000-0000").isVisible(), "settings save and show on the site");
await page.getByLabel("Telefone / WhatsApp").fill("");
await page.getByRole("button", { name: "Salvar", exact: true }).click();
await page.getByText("Configurações salvas.").waitFor();

// Delete
await page.goto(`${BASE}/admin`);
await page.getByTestId("row-teste-corp").getByRole("button", { name: "Excluir Teste Corp" }).click();
await page.waitForTimeout(800);
await page.reload();
expect((await page.getByTestId("row-teste-corp").count()) === 0, "deletes the opportunity");

// Archive filter on the public site
await pub.goto(`${BASE}/`);
await pub.getByRole("button", { name: /^Projects/ }).click();
await pub.waitForTimeout(500);
const rows = await pub.locator("#archive li").count();
expect(rows === 4, `archive filter shows only projects (${rows})`);

expect(errors.length === 0, `no page errors ${errors.join(" | ")}`);
await browser.close();
console.log(`\nAll ${n} checks passed.`);
