<script>
    import { page } from "$app/stores";
    import { mailStore } from "$lib/store.js";
    import { derived } from "svelte/store";

    let serviceName = "";
    let serviceUrl = "";

    let showDialog = false; // 데이터 제거 다이얼로그
    let editDialog = false; // 서비스 수정 다이얼로그

    // @ts-expect-error
    let targetId = null; // 데이터 제거 시 사용되는 타겟 ID

    const id = /** @type {string} */ ($page.params.id);

    const mail = derived(mailStore, ($mailStore) =>
        $mailStore.find(
            /** @type {function(any): boolean} */ (m) => m.id === id,
        ),
    );

    function addService() {
        if (!serviceName) return;
        if (!serviceUrl.startsWith("http://") && !serviceUrl.startsWith("https://")) {
            serviceUrl = "https://" + serviceUrl;
        }; // serviceUrl에서 http나 https가 있는지 확인하는 로직

        mailStore.addService(id, {
            id: crypto.randomUUID(),
            name: serviceName,
            url: serviceUrl,
        });

        serviceName = "";
        serviceUrl = "";
    }

    function editService() {

    }
</script>

<!-- 이메일 용도 삭제 다이얼로그 -->
{#if showDialog}
    <div
        class="window"
        style="width: 200px; position: fixed; top: 42%; left: 45%;"
    >
        <div class="title-bar">
            <div class="title-bar-text">서비스 삭제</div>
            <div class="title-bar-controls">
                <button
                    aria-label="Close"
                    onclick={() => {
                        targetId = null;
                        showDialog = false;
                    }}
                ></button>
            </div>
        </div>
        <div class="window-body">
            <p>
                정말로 삭제하시겠습니까? <br />
                <span style="color: red;"
                    >삭제할 경우 다시 복원할 수 없게됩니다.</span
                >
            </p>
            <div class="field-row" style="justify-content: flex-end;">
                <button
                    onclick={() => {
                        // @ts-ignore
                        mailStore.removeService(id, targetId);
                        showDialog = false;
                    }}>예</button
                >
                <button
                    onclick={() => {
                        targetId = null;
                        showDialog = false;
                    }}>아니오</button
                >
            </div>
        </div>
    </div>
{/if}

{#if editDialog}
    <div
        class="window"
        style="width: 200px; position: fixed; top: 42%; left: 45%;"
    >
        <div class="title-bar">
            <div class="title-bar-text">서비스 수정</div>
            <div class="title-bar-controls">
                <button
                    aria-label="Close"
                    onclick={() => {
                        targetId = null;
                        editDialog = false;
                    }}
                ></button>
            </div>
        </div>
    </div>
{/if}

{#if $mail}
    <a href="/">목록으로 돌아가기</a>
    <h1 class="desktop-title-email">{$mail.email}</h1>
    <p>{$mail.description}</p>
    <span>{$mail.tag}</span>

    <h2 class="desktop-title">서비스 목록</h2>
    <div>
        <input type="text" bind:value={serviceName} placeholder="서비스 이름" />
        <input type="text" bind:value={serviceUrl} placeholder="URL (선택)" />
        <button onclick={addService}>서비스 추가</button>
    </div>

    <ul>
        {#each $mail.services || [] as service}
            <li>
                {#if service.url}
                    <a href={service.url} target="_blank" rel="noopener noreferrer">{service.name}</a>
                {:else}
                    <span>{service.name}</span>
                {/if}
                <button
                    onclick={() => {
                        targetId = service.id;
                        showDialog = true;
                    }}>삭제</button
                >
                <button onclick={() => {
                    targetId = service.id;
                    editDialog = true;
                }}>수정</button>
            </li>
        {/each}
    </ul>
{:else}
    <p>서비스를 불러올 수 없습니다.</p>
{/if}